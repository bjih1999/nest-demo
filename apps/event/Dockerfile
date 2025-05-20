FROM ubuntu:latest
LABEL authors="byeonjihyeon"

# 1단계: 빌드 단계
FROM node:18-alpine AS builder

# 작업 디렉터리 생성 및 설정
WORKDIR /app

# package.json과 package-lock.json (또는 yarn.lock) 복사
COPY package.json ./
COPY package-lock.json ./


# 의존성 설치
RUN npm ci

# 소스 코드 복사
COPY . .

# NestJS 빌드 (TypeScript 컴파일)
RUN npm run build

# 2단계: 실행 단계
FROM node:18-alpine

WORKDIR /app

# production 의존성만 설치
COPY package.json ./
RUN npm install

# 빌드된 결과물을 복사
COPY --from=builder /app/dist ./dist

COPY .env ./

# 앱 실행 (main.js 실행)
CMD ["node", "dist/main.js"]

# 기본 포트 (NestJS 기본 3000)
EXPOSE 3000
