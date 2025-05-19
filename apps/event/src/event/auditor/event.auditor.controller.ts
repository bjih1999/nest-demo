import { Controller, Get, Query } from '@nestjs/common';
import { EventAuditorService } from './event.auditor.service';
import { SearchRewardRequestsQueryDto } from '../request/admin-reward-requests.query.dto';
import { SearchRewardHistoryResponseDto } from '../response/search-reward-history.response.dto';

@Controller('event/auditor')
export class EventAuditorController {
  constructor(private readonly eventAuditorService: EventAuditorService) {}

  @Get('reward-requests')
  async getAllRewardRequests(
    @Query() query: SearchRewardRequestsQueryDto,
  ): Promise<SearchRewardHistoryResponseDto> {
    return this.eventAuditorService.getAllRewardRequests(query);
  }
}
