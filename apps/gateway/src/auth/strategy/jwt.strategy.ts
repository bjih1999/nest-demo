import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';
import { ConfigService } from "@nestjs/config";
import { JwtPayload } from "../jwt/payload/jwt-payload";
import { AccountInfo } from "../jwt/payload/account-info";
import { Role } from "../role/role";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    const authServerUrl = configService.get<string>('AUTH_SERVER_URL');
    const temp = ExtractJwt.fromAuthHeaderAsBearerToken();
    console.log('temp', temp);
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${authServerUrl}/jwks`,  // JWKS endpoint 주소
      }),
      algorithms: ['ES512'],  // P-521 곡선에 맞는 알고리즘
    } as StrategyOptions);
  }

  validate(payload: JwtPayload): AccountInfo {
    // 토큰 검증 성공 후 payload 리턴
    return {
      userId: payload.aud,
      role: Role[payload.role],
    };
  }
}
