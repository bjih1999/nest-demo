import {Controller, Req, Res, All, UseGuards, RawBodyRequest} from "@nestjs/common";
import { Request, Response } from 'express';
import { errorCode } from '../common/error/error-code';
import Server, { createProxyServer } from "http-proxy";
import { ConfigService } from "@nestjs/config";
import { Agent } from "http";
import * as http from "node:http";
import { JwtAuthGuard } from "../auth/guard/jwt.auth.gaurd";
import { GetAccount } from "../auth/decorator/get-account";
import { AccountInfo } from "../auth/jwt/payload/account-info";
import { Roles } from "../auth/decorator/role.decorator";
import { RoleGuard } from "../auth/guard/role.guard";
import {Role} from "../auth/role/role";

@Controller()
export class GatewayController {
  private readonly TARGET_SERVERS: Record<string, string>;
  private readonly proxy: Server<http.IncomingMessage, http.ServerResponse>;

  constructor(private readonly configService: ConfigService) {
    this.proxy = createProxyServer(
      {
        changeOrigin: true,
        agent: new Agent({ keepAlive: true }),
        timeout: 30000,
      },
    );

    this.proxy.on('proxyReq', (proxyReq, req: RawBodyRequest<Request>) => {
      if (req.rawBody) {
        proxyReq.write(req.rawBody);
      }
    });

    this.TARGET_SERVERS = {
      auth: configService.get<string>('AUTH_SERVER_URL'),
      event: configService.get<string>('EVENT_SERVER_URL'),
    };
  }

  @All('/auth/login')
  proxyAuthUserRequest(@Req() req: Request, @Res() res: Response, @GetAccount() account: AccountInfo) {

    this.proxy.web(req, res, { target: this.TARGET_SERVERS.auth }, (err) => {
      console.error('Proxy error:', err);
      if (!res.headersSent) {
        res.status(500).json({
          message: '서버 내부 오류입니다.',
          errorCode: errorCode.INTERNAL_SERVER_ERROR.code,
        });
      }
    });
  }

  /**
   * gateway단에서 인증을 거친 후, 각 서버로 요청을 전달합니다.
   * gateway에서 특정 API의 권한과 어느 서버로 요청을 보내야 하는지 확인할 수 있도록 엔드포인트의 경로에 권한과 서버 이름을 포함시켰습니다.
   * ex. auth/admin/* -> auth 서버로 요청을 보내고, admin 권한이 필요함
   */


  @All('/auth/admin/*')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  proxyAuthAdminRequest(@Req() req: Request, @Res() res: Response, @GetAccount() account: AccountInfo) {

    this.proxy.web(req, res, {
      target: this.TARGET_SERVERS.auth,
      headers: {
        userId: account.userId,
        role: account.role,
      },
    }, (err) => {
      console.error('Proxy error:', err);
      if (!res.headersSent) {
        res.status(500).json({
          message: '서버 내부 오류입니다.',
          errorCode: errorCode.INTERNAL_SERVER_ERROR.code,
        });
      }
    });
  }

  @All('/event/operator/*')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.OPERATOR, Role.ADMIN)
  proxyEventOperatorRequest(@Req() req: Request, @Res() res: Response, @GetAccount() account: AccountInfo) {

    this.proxy.web(req, res, {
      target: this.TARGET_SERVERS.event,
      headers: {
        userId: account.userId,
        role: account.role,
      },
    }, (err) => {
      console.error('Proxy error:', err);
      if (!res.headersSent) {
        res.status(500).json({
          message: '서버 내부 오류입니다.',
          errorCode: errorCode.INTERNAL_SERVER_ERROR.code,
        });
      }
    });
  }

  @All('/event/auditor/*')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.AUDITOR, Role.OPERATOR, Role.ADMIN)
  proxyEventAuditorRequest(@Req() req: Request, @Res() res: Response, @GetAccount() account: AccountInfo) {

    this.proxy.web(req, res, {
      target: this.TARGET_SERVERS.event,
      headers: {
        userId: account.userId,
        role: account.role,
      },
    }, (err) => {
      console.error('Proxy error:', err);
      if (!res.headersSent) {
        res.status(500).json({
          message: '서버 내부 오류입니다.',
          errorCode: errorCode.INTERNAL_SERVER_ERROR.code,
        });
      }
    });
  }

  @All('/event/user/*')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.USER, Role.AUDITOR, Role.OPERATOR, Role.ADMIN)
  proxyEventUserRequest(@Req() req: Request, @Res() res: Response, @GetAccount() account: AccountInfo) {

    this.proxy.web(req, res, {
      target: this.TARGET_SERVERS.event,
      headers: {
        userId: account.userId,
        role: account.role,
      },
    }, (err) => {
      console.error('Proxy error:', err);
      if (!res.headersSent) {
        res.status(500).json({
          message: '서버 내부 오류입니다.',
          errorCode: errorCode.INTERNAL_SERVER_ERROR.code,
        });
      }
    });
  }
}
