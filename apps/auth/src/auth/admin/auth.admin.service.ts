import { Injectable } from '@nestjs/common';
import { UserDto } from "../response/user.dto";
import { UserRegisterRequestDto } from "../request/user-regiser.request.dto";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "../../db/schemas/user.schema";
import { Model } from "mongoose";
import { ApplicationException } from "../../common/error/application-exception";
import { errorCode } from "../../common/error/error-code";
import * as crypto from 'crypto';

@Injectable()
export class AuthAdminService {

  constructor(@InjectModel(User.name) private userModel: Model<User>) {
  }

  async register(userRegisterRequestDto: UserRegisterRequestDto): Promise<UserDto> {
    const { userId } = userRegisterRequestDto;
    const existUser = !!await this.userModel.find({ userId });
    if (existUser) {
      throw new ApplicationException(errorCode.DUPLICATE_USER_ID);
    }

    const { salt, hashedData } = this.hashPassword(userRegisterRequestDto.password);
    const user = new this.userModel({
      userId,
      password: hashedData,
      role: userRegisterRequestDto.role,
      salt,
    });
    await user.save();

    return {
      userId: user.userId,
      role: user.role,
    };
  }

  private hashPassword(password: string): { salt: string; hashedData: string } {
    // Salt 생성 (기본적으로 16바이트 길이의 임의 문자열)
    const salt = crypto.randomBytes(16).toString('hex');

    // 데이터와 salt를 결합하여 해싱
    const hash = crypto.createHash('sha512');
    hash.update(password + salt);  // data + salt를 결합해서 해싱
    const hashedData = hash.digest('hex');  // 'hex' 형식으로 해싱된 결과 반환

    // salt와 함께 해시 값 반환 (salt는 나중에 사용해야 하므로 저장 필요)
    return {
      salt,
      hashedData,
    };
  }

  async updateUser(userId: string, UserUpdateRequestDto): Promise<UserDto> {

    const existUser = await this.userModel.findById(userId);
    if (!existUser) {
      throw new ApplicationException(errorCode.INVALID_INPUT_ERROR);
    }

    const { password, role } = UserUpdateRequestDto;

    const updatedUser = await this.userModel.findByIdAndUpdate(userId, {
      password: password ? this.hashPassword(password).hashedData : existUser.password,
      salt,
      role: role ? role : existUser.role,
    }, { new: true });

    return ;
  }
}
