import { IsOptional, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class UserRewardRequestsQueryDto {
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
}