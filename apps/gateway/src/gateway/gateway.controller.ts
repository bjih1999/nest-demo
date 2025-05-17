import { Controller, Req, Res, All } from '@nestjs/common';
import { Request, Response } from 'express';
import { errorCode } from '../common/error/error-code';
import Server, { createProxyServer } from "http-proxy";
import { ApplicationException } from "../common/error/application-exception";
import { ConfigService } from "@nestjs/config";
import { Agent } from "http";
import * as http from "node:http";

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

  @All('*')
  proxyRequest(@Req() req: Request, @Res() res: Response) {
    const targetKey = req.headers['x-target-service'] as string;
    const target = this.TARGET_SERVERS[targetKey?.toLowerCase()];

    if (!target) {
      throw new ApplicationException(errorCode.INVALID_TARGET_SERVICE);
    }

    this.proxy.web(req, res, { target }, (err) => {
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
