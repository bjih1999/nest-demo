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
  DUPLICATE_USER_ID: {
    name: 'DUPLICATE_USER_ID',
    message: '이미 존재하는 사용자 ID입니다.',
    code: 'A101',
    httpStatusCode: HttpStatus.BAD_REQUEST,
  },
  GATEWAY_SERVER_ERROR: {
    name: 'INTERNAL_SERVER_ERROR',
    message: '서버 내부 오류입니다.',
    code: '900',
    httpStatusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  INTERNAL_SERVER_ERROR: {
    name: 'INTERNAL_SERVER_ERROR',
    message: '서버 내부 오류입니다.',
    code: '901',
    httpStatusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  INVALID_TARGET_SERVICE: {
    name: 'INVALID_TARGET_SERVICE',
    message: '잘못된 target service입니다.',
    code: '1000',
    httpStatusCode: HttpStatus.BAD_REQUEST,
  },
} as const;

export type ErrorCode = (typeof errorCode)[keyof typeof errorCode];
