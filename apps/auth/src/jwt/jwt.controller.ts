import { Controller, Get } from "@nestjs/common";
import { JwtService } from "./jwt.service";

@Controller()
export class JwtController {

  constructor(private readonly jwtService: JwtService) {}

  @Get('jwks')
  getJwks() {
    return this.jwtService.getJwks();
  }
}
