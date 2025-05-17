import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { LoggerService } from '../../logger/logger.service';
import { ErrorResponse } from './error-response';
import { errorCode } from './error-code';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const message = exception.message;
    const errorStack = exception.stack;

    this.logger.error(`[${exception.name}] ${message}`, errorStack);

    const errorResponse: ErrorResponse = {
      message,
      errorCode: errorCode.INTERNAL_SERVER_ERROR.code,
      timestamp: new Date(),
    };

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse);
  }
}
