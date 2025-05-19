import { EventResponseDto } from './event-response.dto';

export class EventListResponseDto {
  events: EventResponseDto[];
  total: number;
  page: number;
  pageSize: number;
}