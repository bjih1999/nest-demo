import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type RewardRequestDocument = HydratedDocument<RewardRequest>;

@Schema({ timestamps: true })
export class RewardRequest {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Event' })
  eventId: Types.ObjectId;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, default: false })
  success: boolean;

  @Prop({ required: true, default: true })
  failed: boolean;

  @Prop({ default: Date.now })
  requestedAt: Date;
}

export const RewardRequestSchema = SchemaFactory.createForClass(RewardRequest);

// userId, eventId, success가 모두 true인 경우에만 unique 제약
RewardRequestSchema.index(
  { userId: 1, eventId: 1, success: 1 },
  {
    unique: true,
    partialFilterExpression: { success: true },
  },
);
