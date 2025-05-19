import { SearchRewardRequestHistoryDto } from './search-reward-request-history.response.dto';

export class SearchRewardHistoryResponseDto {
  requestHistory: SearchRewardRequestHistoryDto[];
  total: number;
  page: number;
  pageSize: number;
}