import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginRequestDto } from "./request/login.request.dto";
import { LoginResponseDto } from "./response/login.response.dto";

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginRequestDto: LoginRequestDto): Promise<LoginResponseDto> {
    return this.authService.login(loginRequestDto);
  }
}