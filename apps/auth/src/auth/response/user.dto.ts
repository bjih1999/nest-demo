import { Role } from "../../role/role";
import { IsEnum, IsString } from "class-validator";

export class UserDto {
  userId: string;

  role: Role;
}