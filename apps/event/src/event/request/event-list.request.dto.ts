import { IsBoolean, IsOptional, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class EventListRequestDto {
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isActive?: boolean;

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