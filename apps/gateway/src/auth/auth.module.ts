import { Module } from '@nestjs/common';
import { JwtAuthGuard } from "./guard/jwt.auth.gaurd";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { PassportModule } from "@nestjs/passport";
import { RoleGuard } from "./guard/role.guard";

@Module({
  imports: [PassportModule],
  providers: [JwtStrategy, JwtAuthGuard, RoleGuard],
  exports: [JwtAuthGuard, RoleGuard]
})
export class AuthModule {
}
