import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "../db/schemas/user.schema";
import { JwtModule } from '../jwt/jwt.module';
import { AuthAdminController } from './admin/auth.admin.controller';
import { AuthAdminService } from './admin/auth.admin.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule
  ],
  controllers: [AuthController, AuthAdminController],
  providers: [AuthService, AuthAdminService]
})
export class AuthModule {}
