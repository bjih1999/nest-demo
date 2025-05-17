import { ErrorCode } from './error-code';

export class ApplicationException extends Error {
  errorCode: ErrorCode;

  constructor(errorCode: ErrorCode, error?: Error) {
    super(errorCode.message);
    this.errorCode = errorCode;
    this.stack = error?.stack;
    this.name = errorCode.name;
    this.message = errorCode.message;
  }
}
