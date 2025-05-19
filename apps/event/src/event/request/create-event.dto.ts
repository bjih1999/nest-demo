import {
  IsString,
  IsArray,
  ArrayNotEmpty,
  IsDateString,
  IsBoolean,
  ValidateNested,
  IsNumber,
  IsDate,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class EventConditionDto {
  @IsString()
  activityType: string;

  @IsNumber()
  targetCount: number;

  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsString()
  description: string;
}

export class CreateEventDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => EventConditionDto)
  conditions: EventConditionDto[];

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsBoolean()
  isActive: boolean;
}