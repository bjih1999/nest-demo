import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EventDocument = HydratedDocument<Event>;

export interface EventCondition {
  activityType: string; // ex. 'login', 'friend_invite', 'quest_complete'
  targetCount: number; //ex. 7 (번), 3 (명)
  startDate: Date; // 이벤트 시작일
  endDate: Date; // 이벤트 종료일
  description: string;
}

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [{ type: Object }], required: true })
  conditions: EventCondition[];

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ default: true })
  isActive: boolean;
}

export const EventSchema = SchemaFactory.createForClass(Event);