import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from "../../role/role";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, default: Role.USER, enum: Role })
  role: Role;

  @Prop({ required: true })
  salt: string;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);