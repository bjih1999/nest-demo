import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApplicationException } from "../../common/error/application-exception";
import { errorCode } from "../../common/error/error-code";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 메타데이터에서 역할(role)을 가져옴
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true; // 역할이 없다면 모든 사용자에게 허용
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // JWT 토큰에서 인증된 사용자 정보

    // 역할을 비교하여 권한을 체크
    const hasRole = roles.some(role => user.role == role);
    if (!hasRole) {
      throw new ApplicationException(errorCode.UNAUTHORIZED);
    }

    return true; // 역할이 맞다면 true
  }
}
