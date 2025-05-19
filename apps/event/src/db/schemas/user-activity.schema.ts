import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserActivityDocument = HydratedDocument<UserActivity>;

@Schema({ timestamps: true })
export class UserActivity {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  activityType: string;

  @Prop({ default: Date.now })
  activityAt: Date;
}

export const UserActivitySchema = SchemaFactory.createForClass(UserActivity);

// Create compound index for efficient querying
UserActivitySchema.index({ userId: 1, activityAt: 1, activityType: 1 });