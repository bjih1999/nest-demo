import { IsEnum, IsOptional, IsString } from "class-validator";
import { Role } from "../../../role/role";

export class UserUpdateRequestDto {
  @IsString()
  @IsOptional()
  password?: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}