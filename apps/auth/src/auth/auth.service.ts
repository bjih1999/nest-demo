import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../db/schemas/user.schema';
import { LoginRequestDto } from './request/login.request.dto';
import { LoginResponseDto } from './response/login.response.dto';
import * as bcrypt from 'bcrypt';
import { JwtProvider } from '../jwt/jwt-provider/jwt-provider';
import { ApplicationException } from "../common/error/application-exception";
import { errorCode } from "../common/error/error-code";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtProvider: JwtProvider,
  ) {}

  async login(loginRequestDto: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.userModel.findOne({ userId: loginRequestDto.userId });
    
    if (!user) {
      throw new ApplicationException(errorCode.UNAUTHORIZED);
    }

    const isPasswordValid = await bcrypt.compare(
      loginRequestDto.password + user.salt,
      user.password
    );

    if (!isPasswordValid) {
      throw new ApplicationException(errorCode.UNAUTHORIZED);
    }

    const accessToken = await this.jwtProvider.generateToken(user.userId, user.role);

    return {
      accessToken,
    };
  }
}