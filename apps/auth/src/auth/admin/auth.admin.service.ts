import { Injectable } from '@nestjs/common';
import { UserDto } from "../response/user.dto";
import { UserRegisterRequestDto } from "../request/user-regiser.request.dto";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../../db/schemas/user.schema";
import { Model } from "mongoose";
import { ApplicationException } from "../../common/error/application-exception";
import { errorCode } from "../../common/error/error-code";
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { UserUpdateRequestDto } from './request/user-update.request.dto';

@Injectable()
export class AuthAdminService {

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
  }

  async register(userRegisterRequestDto: UserRegisterRequestDto): Promise<UserDto> {
    const { userId } = userRegisterRequestDto;
    const existUser = this.userModel.findOne({ userId }).lean();
    if (existUser) {
      throw new ApplicationException(errorCode.DUPLICATE_USER_ID);
    }

    const { salt, hashedPassword } = await this.hashPassword(userRegisterRequestDto.password);
    const user = new this.userModel({
      userId,
      password: hashedPassword,
      role: userRegisterRequestDto.role,
      salt,
    });
    await user.save();

    return {
      userId: user.userId,
      role: user.role,
    };
  }

  private async hashPassword(password: string): Promise<{ salt: string; hashedPassword: string }> {
    // Salt 생성
    const salt = crypto.randomBytes(16).toString('hex');
    
    // bcrypt를 사용해 비밀번호 해싱 (salt 포함)
    const hashedPassword = await bcrypt.hash(password + salt, 10);

    return {
      salt,
      hashedPassword,
    };
  }

  async updateUser(userId: string, userUpdateRequestDto: UserUpdateRequestDto): Promise<UserDto> {
    const existUser = await this.userModel.findOne({ userId }).lean();
    if (!existUser) {
      throw new ApplicationException(errorCode.USER_NOT_FOUND);
    }

    const updateData: any = {};

    if (userUpdateRequestDto.password) {
      const { salt, hashedPassword } = await this.hashPassword(userUpdateRequestDto.password);
      updateData.password = hashedPassword;
      updateData.salt = salt;
    }

    if (userUpdateRequestDto.role) {
      updateData.role = userUpdateRequestDto.role;
    }

    const updatedUser = await this.userModel.findOneAndUpdate(
      { userId },
      updateData,
      { new: true }
    );

    return {
      userId: updatedUser.userId,
      role: updatedUser.role,
    };
  }
}