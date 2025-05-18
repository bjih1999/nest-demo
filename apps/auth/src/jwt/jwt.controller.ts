import { Controller, Get } from "@nestjs/common";
import { JwtService } from "./jwt.service";
import { JWK } from "jose";

@Controller()
export class JwtController {

  constructor(private readonly jwtService: JwtService) {}

  @Get('jwks')
  getJwks(): { keys: JWK[] } {
    return this.jwtService.getJwks();
  }
}
