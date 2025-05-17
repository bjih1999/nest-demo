import { Controller, Req, Res, All } from '@nestjs/common';
import { Request, Response } from 'express';
import * as httpProxy from 'http-proxy';

const proxy = httpProxy.createProxyServer({});

const TARGET_SERVERS = {
  auth: 'http://auth-service',
  event: 'http://event-service',
};

@Controller('proxy')
export class ProxyController {
  @All('*')
  proxyRequest(@Req() req: Request, @Res() res: Response) {
    const targetKey = req.headers['x-target-service'] as string;
    const target = TARGET_SERVERS[targetKey?.toLowerCase()];

    if (!target) {
      res.status(400).send('Invalid target service');
      return;
    }

    proxy.web(req, res, { target }, (err) => {
      console.error('Proxy error:', err);
      if (!res.headersSent) {
        res.status(500).send('Proxy error');
      }
    });
  }
}
