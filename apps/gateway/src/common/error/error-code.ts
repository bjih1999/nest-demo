import { HttpStatus } from '@nestjs/common';

interface ErrorContent {
  name: string;
  code: string;
  message?: string;
  httpStatusCode: HttpStatus;
}

export const errorCode: Record<string, ErrorContent> = {
  INVALID_INPUT_ERROR: {
    name: 'INVALID_INPUT_ERROR',
    code: 'A100',
    message: '잘못된 입력값입니다.',
    httpStatusCode: HttpStatus.BAD_REQUEST,
  },
  UNAUTHORIZED: {
    name: 'UNAUTHORIZED',
    message: '인증되지 않은 사용자입니다.',
    code: 'B100',
    httpStatusCode: HttpStatus.UNAUTHORIZED,
  },
  GATEWAY_SERVER_ERROR: {
    name: 'INTERNAL_SERVER_ERROR',
    message: '서버 내부 오류입니다.',
    code: 'C100',
    httpStatusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  INTERNAL_SERVER_ERROR: {
    name: 'INTERNAL_SERVER_ERROR',
    message: '서버 내부 오류입니다.',
    code: 'C101',
    httpStatusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  },
} as const;

export type ErrorCode = (typeof errorCode)[keyof typeof errorCode];
