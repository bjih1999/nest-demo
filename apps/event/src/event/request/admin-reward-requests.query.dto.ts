import { IsOptional, IsString, IsInt, Min, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { RewardRequestStatus } from '../enum/reward-request-status.enum';

export class SearchRewardRequestsQueryDto {
  @IsOptional()
  @IsString()
  eventId?: string;

  @IsOptional()
  @IsEnum(RewardRequestStatus)
  status?: RewardRequestStatus;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  pageSize?: number = 20;

  @IsOptional()
  @IsString()
  userId?: string;
}
