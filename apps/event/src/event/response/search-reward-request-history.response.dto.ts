import { RewardRequestStatus } from '../enum/reward-request-status.enum';

export class SearchRewardRequestHistoryDto {
  requestId: string;
  eventId: string;
  userId: string;
  status: RewardRequestStatus;
  requestedAt: Date;
}