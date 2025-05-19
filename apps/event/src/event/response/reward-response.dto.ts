import { RewardType } from '../enum/reward-type.enum';

export class RewardResponseDto {
  id: string;
  type: RewardType;
  name: string;
  quantity: number;
  eventId: string;
}