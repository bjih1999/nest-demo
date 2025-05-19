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
  DUPLICATE_REWARD_REQUEST: {
    name: 'DUPLICATE_REWARD_REQUEST',
    message: '이미 신청한 보상입니다.',
    code: 'A101',
    httpStatusCode: HttpStatus.BAD_REQUEST,
  },
  DUPLICATE_USER_ID: {
    name: 'DUPLICATE_USER_ID',
    message: '이미 존재하는 사용자 ID입니다.',
    code: 'A102',
    httpStatusCode: HttpStatus.BAD_REQUEST,
  },
  UNAUTHORIZED: {
    name: 'UNAUTHORIZED',
    message: '인증되지 않은 사용자입니다.',
    code: 'A102',
    httpStatusCode: HttpStatus.UNAUTHORIZED,
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
  EVENT_NOT_FOUND: {
    name: 'EVENT_NOT_FOUND',
    message: '이벤트를 찾을 수 없습니다.',
    code: 'E001',
    httpStatusCode: HttpStatus.NOT_FOUND,
  },
  EVENT_NOT_IN_PERIOD: {
    name: 'EVENT_NOT_IN_PERIOD',
    message: '이벤트 기간이 아닙니다.',
    code: 'E002',
    httpStatusCode: HttpStatus.BAD_REQUEST,
  },
  EVENT_NOT_ACTIVE: {
    name: 'EVENT_NOT_ACTIVE',
    message: '활성화되지 않은 이벤트입니다.',
    code: 'E003',
    httpStatusCode: HttpStatus.BAD_REQUEST,
  },
} as const;

export type ErrorCode = (typeof errorCode)[keyof typeof errorCode];
