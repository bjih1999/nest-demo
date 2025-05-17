import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ApplicationException } from './application-exception';
import { LoggerService } from '../../logger/logger.service';
import { ErrorResponse } from './error-response';

@Catch(ApplicationException)
export class ApplicationExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: ApplicationException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const httpStatusCode = exception.errorCode.httpStatusCode;
    const code = exception.errorCode.code;
    const message = exception.message;
    const errorStack = exception.stack;
    const exceptionName = exception.name;

    this.logger.error(`[${exceptionName}] ${message}`, errorStack);

    const errorResponse: ErrorResponse = {
      message,
      errorCode: code,
      timestamp: new Date(),
    };

    response.status(httpStatusCode).json(errorResponse);
  }
}
