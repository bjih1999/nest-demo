import { Controller, Get, Param, Post, Headers, Query } from '@nestjs/common';
import { EventService } from './event.service';
import { EventListRequestDto } from '../request/event-list.request.dto';
import { EventListResponseDto } from '../response/event-list.response.dto';
import { RewardListResponseDto } from '../response/reward-list.response.dto';
import { RewardRequestResponseDto } from '../response/reward-request.response.dto';
import { UserRewardRequestsQueryDto } from '../request/user-reward-requests.query.dto';
import { UserRewardRequestListResponseDto } from '../response/user-reward-request-list.response.dto';

@Controller('event/user')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get('events')
  async getUserEvents(
    @Query() query: EventListRequestDto,
  ): Promise<EventListResponseDto> {
    return this.eventService.getUserEvents(query);
  }

  @Get('events/:eventId/rewards-logs')
  async getEventRewardLogs(
    @Param('eventId') eventId: string,
  ): Promise<RewardListResponseDto> {
    return this.eventService.getEventRewardLogs(eventId);
  }

  @Post('events/:eventId/rewards')
  async requestReward(
    @Param('eventId') eventId: string,
    @Headers('userid') userId: string,
  ): Promise<RewardRequestResponseDto> {
    return this.eventService.requestReward(eventId, userId);
  }

  @Get('reward-requests')
  async getUserRewardRequests(
    @Headers('userid') userId: string,
    @Query() query: UserRewardRequestsQueryDto,
  ): Promise<UserRewardRequestListResponseDto> {
    return this.eventService.getUserRewardRequests(userId, query);
  }
}