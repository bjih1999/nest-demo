export interface EventConditionResponse {
  activityType: string;
  targetCount: number;
  startDate: Date;
  endDate: Date;
  description: string;
}

export class EventResponseDto {
  id: string;
  title: string;
  description: string;
  conditions: EventConditionResponse[];
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}