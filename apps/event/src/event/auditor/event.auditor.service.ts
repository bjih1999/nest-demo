import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SearchRewardRequestsQueryDto } from '../request/admin-reward-requests.query.dto';
import { SearchRewardHistoryResponseDto } from '../response/search-reward-history.response.dto';
import {
  RewardRequest,
  RewardRequestDocument,
} from '../../db/schemas/reward-request.schema';
import { RewardRequestStatus } from '../enum/reward-request-status.enum';

@Injectable()
export class EventAuditorService {
  constructor(
    @InjectModel(RewardRequest.name)
    private rewardRequestModel: Model<RewardRequestDocument>,
  ) {}

  async getAllRewardRequests(
    query: SearchRewardRequestsQueryDto,
  ): Promise<SearchRewardHistoryResponseDto> {
    const { page, pageSize, eventId, status, userId } = query;
    const skip = (page - 1) * pageSize;

    const filter: any = {};
    if (eventId) {
      filter.eventId = eventId;
    }
    if (status) {
      if (status === RewardRequestStatus.SUCCESS) {
        filter.success = true;
        filter.failed = false;
      } else {
        filter.success = false;
        filter.failed = true;
      }
    }
    if (userId) {
      filter.userId = userId;
    }

    const [requests, total] = await Promise.all([
      this.rewardRequestModel.find(filter).skip(skip).limit(pageSize).lean(),
      this.rewardRequestModel.countDocuments(filter),
    ]);

    return {
      requestHistory: requests.map((request) => ({
        requestId: request._id.toString(),
        eventId: request.eventId.toString(),
        userId: request.userId,
        status:
          request.success && !request.failed
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
