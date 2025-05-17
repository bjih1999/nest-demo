import { Module } from '@nestjs/common';
import { JwtController } from './jwt.controller';
import { JwtService } from './jwt.service';
import { JwtProvider } from "./jwt-provider/jwt-provider";

@Module({
  controllers: [JwtController],
  providers: [JwtService, JwtProvider]
})
export class JwtModule {}
