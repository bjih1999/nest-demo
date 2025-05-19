import { IsString, IsInt, Min, IsEnum } from 'class-validator';
import { RewardType } from '../enum/reward-type.enum';

export class CreateRewardDto {
  @IsEnum(RewardType)
  type: RewardType;

  @IsString()
  name: string;

  @IsInt()
  @Min(1)
  quantity: number;
}