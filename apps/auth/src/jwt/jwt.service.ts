import { Injectable } from '@nestjs/common';
import { JwtProvider } from "./jwt-provider/jwt-provider";
import { JWK } from "jose";

@Injectable()
export class JwtService {

  constructor(private readonly jwtProvider: JwtProvider) {}

  getJwks(): { keys: JWK[] } {
    return this.jwtProvider.getJwks();
  }
}
