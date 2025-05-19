import { Body, Controller, Param, Post, Put } from "@nestjs/common";
import { AuthAdminService } from "./auth.admin.service";
import { UserDto } from "../response/user.dto";
import { UserRegisterRequestDto } from "../request/user-regiser.request.dto";
import { UserUpdateRequestDto } from "./request/user-update.request.dto";

@Controller('auth/admin')
export class AuthAdminController {

  constructor(private readonly authAdminService: AuthAdminService) {}

  @Post('user')
  async register(@Body() userRegisterRequestDto: UserRegisterRequestDto): Promise<UserDto> {
    return this.authAdminService.register(userRegisterRequestDto);
  }

  @Put('user/:userId')
  async updateUser(@Param('userId') userId: string, @Body() userUpdateRequestDto: UserUpdateRequestDto): Promise<UserDto> {
    return this.authAdminService.updateUser(userId, userUpdateRequestDto);
  }
}
