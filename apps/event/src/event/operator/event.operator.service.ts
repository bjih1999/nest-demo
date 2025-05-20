import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEventDto } from '../request/create-event.dto';
import { CreateRewardDto } from '../request/create-reward.dto';
import { EventResponseDto } from '../response/event-response.dto';
import { RewardResponseDto } from '../response/reward-response.dto';
import { Event, EventDocument } from '../../db/schemas/event.schema';
import { Reward, RewardDocument } from '../../db/schemas/reward.schema';

@Injectable()
export class EventOperatorService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @InjectModel(Reward.name) private rewardModel: Model<RewardDocument>,
  ) {}

  async createEvent(createEventDto: CreateEventDto): Promise<EventResponseDto> {
    const event = new this.eventModel({
      title: createEventDto.title,
      description: createEventDto.description,
      conditions: createEventDto.conditions.map((condition) => ({
        activityType: condition.activityType,
        targetCount: condition.targetCount,
        startDate: condition.startDate,
        endDate: condition.endDate,
        description: condition.description,
      })),
      startDate: new Date(createEventDto.startDate),
      endDate: new Date(createEventDto.endDate),
      isActive: createEventDto.isActive,
    });

    await event.save();

    return {
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
    };
  }

  async createReward(
    eventId: string,
    createRewardDto: CreateRewardDto,
  ): Promise<RewardResponseDto> {
    const reward = new this.rewardModel({
      type: createRewardDto.type,
      name: createRewardDto.name,
      quantity: createRewardDto.quantity,
      eventId,
    });

    await reward.save();

    return {
      id: reward._id.toString(),
      type: reward.type,
      name: reward.name,
      quantity: reward.quantity,
      eventId: reward.eventId.toString(),
    };
  }
}
