import { RewardRequestStatus } from '../enum/reward-request-status.enum';

export class RewardRequestResponseDto {
  requestId: string;
  eventId: string;
  userId: string;
  status: RewardRequestStatus;
  requestedAt: Date;
}