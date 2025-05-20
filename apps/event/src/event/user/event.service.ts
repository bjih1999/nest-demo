import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventListRequestDto } from '../request/event-list.request.dto';
import { EventListResponseDto } from '../response/event-list.response.dto';
import { RewardListResponseDto } from '../response/reward-list.response.dto';
import { RewardRequestResponseDto } from '../response/reward-request.response.dto';
import { UserRewardRequestsQueryDto } from '../request/user-reward-requests.query.dto';
import { UserRewardRequestListResponseDto } from '../response/user-reward-request-list.response.dto';
import {
  Event,
  EventDocument,
  EventCondition,
} from '../../db/schemas/event.schema';
import { Reward, RewardDocument } from '../../db/schemas/reward.schema';
import {
  RewardRequest,
  RewardRequestDocument,
} from '../../db/schemas/reward-request.schema';
import {
  UserActivity,
  UserActivityDocument,
} from '../../db/schemas/user-activity.schema';
import { RewardRequestStatus } from '../enum/reward-request-status.enum';
import { ApplicationException } from '../../common/error/application-exception';
import { errorCode } from '../../common/error/error-code';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @InjectModel(Reward.name) private rewardModel: Model<RewardDocument>,
    @InjectModel(RewardRequest.name)
    private rewardRequestModel: Model<RewardRequestDocument>,
    @InjectModel(UserActivity.name)
    private userActivityModel: Model<UserActivityDocument>,
  ) {}

  async getUserEvents(
    query: EventListRequestDto,
  ): Promise<EventListResponseDto> {
    const { page, pageSize, isActive } = query;
    const skip = (page - 1) * pageSize;

    const filter: any = {};
    if (isActive !== undefined) {
      filter.isActive = isActive;
    }

    const [events, total] = await Promise.all([
      this.eventModel.find(filter).skip(skip).limit(pageSize),
      this.eventModel.countDocuments(filter),
    ]);

    return {
      events: events.map((event) => ({
        id: event._id.toString(),
        title: event.title,
        description: event.description,
        conditions: event.conditions.map((condition) => ({
          activityType: condition.activityType,
          targetCount: condition.targetCount,
          startDate: condition.startDate,
          endDate: condition.endDate,
          description: condition.description,
        })),
        startDate: event.startDate,
        endDate: event.endDate,
        isActive: event.isActive,
      })),
      total,
      page,
      pageSize,
    };
  }

  async getEventRewardLogs(eventId: string): Promise<RewardListResponseDto> {
    const rewards = await this.rewardModel.find({ eventId });

    return {
      rewards: rewards.map((reward) => ({
        id: reward._id.toString(),
        type: reward.type,
        name: reward.name,
        quantity: reward.quantity,
        eventId: reward.eventId.toString(),
      })),
    };
  }

  async requestReward(
    eventId: string,
    userId: string,
  ): Promise<RewardRequestResponseDto> {
    // 이벤트 정보 조회
    const event = await this.eventModel.findById(eventId).lean();
    if (!event) {
      throw new ApplicationException(errorCode.EVENT_NOT_FOUND);
    }

    // 이벤트 기간 확인
    const now = new Date();
    if (now < event.startDate || now > event.endDate) {
      throw new ApplicationException(errorCode.EVENT_NOT_IN_PERIOD);
    }

    // 이벤트 활성 상태 확인
    if (!event.isActive) {
      throw new ApplicationException(errorCode.EVENT_NOT_ACTIVE);
    }

    // 조건 충족 여부 확인
    const conditionsMet = await this.checkEventConditions(
      userId,
      event.conditions,
    );

    let success = false;
    let failed = true;

    if (conditionsMet) {
      // 조건을 충족한 경우, 성공으로 저장 시도
      try {
        const rewardRequest = new this.rewardRequestModel({
          eventId,
          userId,
          success: true,
          failed: false,
          requestedAt: new Date(),
        });

        await rewardRequest.save();
        success = true;
        failed = false;

        return {
          requestId: rewardRequest._id.toString(),
          eventId: rewardRequest.eventId.toString(),
          userId: rewardRequest.userId,
          status: RewardRequestStatus.SUCCESS,
          requestedAt: rewardRequest.requestedAt,
        };
      } catch (error) {
        // unique index 에러인 경우 (이미 성공한 요청이 있음)
        if (error.code === 11000) {
          success = false;
          failed = true;
        } else {
          throw error;
        }
      }
    }

    // 실패한 경우 저장
    const rewardRequest = new this.rewardRequestModel({
      eventId,
      userId,
      success,
      failed,
      requestedAt: new Date(),
    });

    await rewardRequest.save();

    return {
      requestId: rewardRequest._id.toString(),
      eventId: rewardRequest.eventId.toString(),
      userId: rewardRequest.userId,
      status: RewardRequestStatus.FAILED,
      requestedAt: rewardRequest.requestedAt,
    };
  }

  private async checkEventConditions(
    userId: string,
    conditions: EventCondition[],
  ): Promise<boolean> {
    for (const condition of conditions) {
      const { activityType, targetCount, startDate, endDate } = condition;

      // 이벤트 기간 동안의 사용자 활동 개수 확인
      const activityCount = await this.userActivityModel.countDocuments({
        userId,
        activityType,
        activityAt: {
          $gte: startDate,
          $lte: endDate,
        },
      });

      // 목표 횟수 미달성시 false 반환
      if (activityCount < targetCount) {
        return false;
      }
    }

    // 모든 조건 충족
    return true;
  }

  async getUserRewardRequests(
    userId: string,
    query: UserRewardRequestsQueryDto,
  ): Promise<UserRewardRequestListResponseDto> {
    const { page, pageSize } = query;
    const skip = (page - 1) * pageSize;

    const [requests, total] = await Promise.all([
      this.rewardRequestModel.find({ userId }).skip(skip).limit(pageSize).lean(),
      this.rewardRequestModel.countDocuments({ userId }),
    ]);

    return {
      requestHistory: requests.map((request) => ({
        requestId: request._id.toString(),
        eventId: request.eventId.toString(),
        status: request.success
          ? RewardRequestStatus.SUCCESS
          : RewardRequestStatus.FAILED,
        requestedAt: request.requestedAt,
      })),
      total,
      page,
      pageSize,
    };
  }
}
