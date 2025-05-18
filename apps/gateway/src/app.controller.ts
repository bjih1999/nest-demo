import { Controller, Get, UseGuards } from "@nestjs/common";
import { AppService } from './app.service';
import { JwtAuthGuard } from "./auth/guard/jwt.auth.gaurd";

@UseGuards(JwtAuthGuard)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('temp')
  getHello(): string {
    return this.appService.getHello();
  }
}
