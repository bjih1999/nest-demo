import { UserRewardRequestHistoryDto } from './user-reward-request-history.dto';

export class UserRewardRequestListResponseDto {
  requestHistory: UserRewardRequestHistoryDto[];
  total: number;
  page: number;
  pageSize: number;
}