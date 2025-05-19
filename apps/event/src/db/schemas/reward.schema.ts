import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { RewardType } from '../../event/enum/reward-type.enum';

export type RewardDocument = HydratedDocument<Reward>;

@Schema({ timestamps: true })
export class Reward {
  @Prop({ required: true, enum: Object.values(RewardType) })
  type: RewardType;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Event' })
  eventId: Types.ObjectId;
}

export const RewardSchema = SchemaFactory.createForClass(Reward);