import { Role } from "../../role/role";
import { IsEnum, IsString } from "class-validator";

export class UserRegisterRequestDto {
  @IsString()
  userId: string;

  @IsString()
  password: string;

  @IsEnum(Role)
  role: Role;
}