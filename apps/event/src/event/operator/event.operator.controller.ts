import { Controller, Post, Body, Param } from '@nestjs/common';
import { EventOperatorService } from './event.operator.service';
import { CreateEventDto } from '../request/create-event.dto';
import { CreateRewardDto } from '../request/create-reward.dto';
import { EventResponseDto } from '../response/event-response.dto';
import { RewardResponseDto } from '../response/reward-response.dto';

@Controller('event/operator')
export class EventOperatorController {
  constructor(private readonly eventOperatorService: EventOperatorService) {}

  @Post('events')
  async createEvent(
    @Body() createEventDto: CreateEventDto,
  ): Promise<EventResponseDto> {
    return this.eventOperatorService.createEvent(createEventDto);
  }

  @Post('events/:eventId/rewards')
  async createReward(
    @Param('eventId') eventId: string,
    @Body() createRewardDto: CreateRewardDto,
  ): Promise<RewardResponseDto> {
    return this.eventOperatorService.createReward(eventId, createRewardDto);
  }
}