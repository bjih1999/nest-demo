import { Controller, Req, Res, All, UseGuards } from "@nestjs/common";
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

    this.TARGET_SERVERS = {
      auth: configService.get<string>('AUTH_SERVER_URL'),
      event: configService.get<string>('EVENT_SERVER_URL'),
    };
  }

  @All('/auth/admin/*')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  proxyAuthAdminRequest(@Req() req: Request, @Res() res: Response, @GetAccount() account: AccountInfo) {

    this.proxy.on('proxyReq', (proxyReq, req) => {
      proxyReq.setHeader('userId', account.userId);
      proxyReq.setHeader('role', account.role);
    });

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

  @All('/auth/user/*')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.USER, Role.AUDITOR, Role.OPERATOR, Role.ADMIN)
  proxyAuthUserRequest(@Req() req: Request, @Res() res: Response, @GetAccount() account: AccountInfo) {
    this.proxy.on('proxyReq', (proxyReq, req) => {
      proxyReq.setHeader('userId', account.userId);
      proxyReq.setHeader('role', account.role);
    });

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

  @All('/event/operator/*')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.OPERATOR, Role.ADMIN)
  proxyEventOperatorRequest(@Req() req: Request, @Res() res: Response, @GetAccount() account: AccountInfo) {

    this.proxy.on('proxyReq', (proxyReq, req) => {
      proxyReq.setHeader('userId', account.userId);
      proxyReq.setHeader('role', account.role);
    });

    this.proxy.web(req, res, { target: this.TARGET_SERVERS.event }, (err) => {
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

    this.proxy.on('proxyReq', (proxyReq, req) => {
      proxyReq.setHeader('userId', account.userId);
      proxyReq.setHeader('role', account.role);
    });

    this.proxy.web(req, res, { target: this.TARGET_SERVERS.event }, (err) => {
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

    this.proxy.on('proxyReq', (proxyReq, req) => {
      proxyReq.setHeader('userId', account.userId);
      proxyReq.setHeader('role', account.role);
    });

    this.proxy.web(req, res, { target: this.TARGET_SERVERS.event }, (err) => {
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
