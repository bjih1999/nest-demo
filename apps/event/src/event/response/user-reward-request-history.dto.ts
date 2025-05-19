import { RewardRequestStatus } from '../enum/reward-request-status.enum';

export class UserRewardRequestHistoryDto {
  requestId: string;
  eventId: string;
  status: RewardRequestStatus;
  requestedAt: Date;
}