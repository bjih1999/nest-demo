# Event & Auth Server API Documentation

## 프로젝트 개요

이 프로젝트는 NestJS 기반의 마이크로서비스 아키텍처로 구성된 이벤트 관리 시스템입니다.

### 서비스 구성
1. **Auth Service**: 사용자 인증 및 권한 관리
   - Base URL: `http://localhost:3001`
   - JWT 토큰 발급 및 검증
   - 사용자 등록 및 관리

2. **Event Service**: 이벤트 및 보상 관리
   - Base URL: `http://localhost:3002`
   - 이벤트 생성 및 관리
   - 보상 요청 및 처리

---

## 시스템 아키텍처

### 전체 아키텍처
![전체 아키텍처](/static/전체%20아키텍처.png)

### 요청 흐름 다이어그램
![요청 흐름 다이어그램](/static/요청%20흐름%20다이어그램.png)

### 데이터베이스 스키마 관계
![데이터베이스 스키마 관계](/static/데이터베이스%20스키마%20관계.png)

---

## 시작하기

### 필수 요구사항
- Docker Desktop 설치
- Docker Compose 설치

### 서버 실행 방법

1. **프로젝트 클론**
   ```bash
   git clone <repository-url>
   cd nest-demo
   ```

2. **Docker Compose로 전체 서비스 실행**
   ```bash
   cd apps
   docker-compose up -d
   ```

   이 명령어는 다음 서비스들을 시작합니다:
   - Gateway Server (Port: 3000)
   - Auth Server (Port: 3001)
   - Event Server (Port: 3002)
   - Auth Database MongoDB (Port: 27017)
   - Event Database MongoDB (Port: 27018)

3. **서비스 상태 확인**
   ```bash
   docker-compose ps
   ```

5. **서비스 중지**
   ```bash
   docker-compose down
   ```

6. **서비스 및 데이터 완전 제거**
   ```bash
   docker-compose down -v
   ```

### API 구조
각 서버는 권한별로 구분된 엔드포인트를 제공합니다:
- **Auth Server**
  - `/auth/*`: 인증 관련 (로그인)
  - `/auth/admin/*`: 사용자 관리 (ADMIN 권한 필요)
  - `/jwks`: JWT 공개키 조회
  
- **Event Server**
  - `/event/user/*`: 일반 사용자용 API
  - `/event/operator/*`: 운영자용 API
  - `/event/auditor/*`: 감사자용 API

## Authorization & Roles

### 권한 체계
시스템은 네 가지 권한 레벨로 구분됩니다:

1. **USER (일반 사용자)**
   - 기본 권한
   - 이벤트 참여 및 보상 요청
   - 본인 정보 조회

2. **OPERATOR (운영자)**
   - 이벤트 생성 및 관리
   - 보상 설정
   - 이벤트 활성화/비활성화

3. **AUDITOR (감사자)**
   - 시스템 전체 모니터링
   - 모든 사용자의 활동 이력 조회
   - 보상 요청 이력 분석

4. **ADMIN (관리자)**
   - 사용자 계정 관리
   - 권한 변경
   - 시스템 전체 관리

### 인증 방식
- JWT (JSON Web Token) 기반 인증
- Authorization 헤더에 Bearer 토큰 포함
- 일부 API는 추가 헤더 요구 (예: userid)

---

## Auth Server APIs

### Base URL
```
http://localhost:3001
```

### 1. Authentication APIs

#### 1.1 로그인
사용자 인증 후 JWT 토큰을 발급합니다.

```
POST /auth/login
```

**Request Body:**
```typescript
{
  userId: string;
  password: string;
}
```

**Response:**
```typescript
{
  accessToken: string;
}
```

**Example Request:**
```json
POST /auth/login
Content-Type: application/json

{
  "userId": "user123",
  "password": "password123"
}
```

**Example Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 2. Admin APIs

#### 2.1 사용자 등록
새로운 사용자를 등록합니다.

```
POST /auth/admin/user
```

**Required Role:** ADMIN

**Request Body:**
```typescript
{
  userId: string;
  password: string;
  role: 'USER' | 'OPERATOR' | 'AUDITOR' | 'ADMIN';
}
```

**Response:**
```typescript
{
  userId: string;
  role: string;
}
```

**Example Request:**
```json
POST /auth/admin/user
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json

{
  "userId": "newuser",
  "password": "password123",
  "role": "USER"
}
```

---

#### 2.2 사용자 정보 수정
기존 사용자의 정보를 수정합니다.

```
PUT /auth/admin/user/:userId
```

**Required Role:** ADMIN

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| userId | string | Yes | 수정할 사용자 ID |

**Request Body:**
```typescript
{
  password?: string;  // 선택적
  role?: 'USER' | 'OPERATOR' | 'AUDITOR' | 'ADMIN';  // 선택적
}
```

**Response:**
```typescript
{
  userId: string;
  role: string;
}
```

**Example Request:**
```json
PUT /auth/admin/user/user123
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json

{
  "role": "OPERATOR"
}
```

---

### 3. JWT APIs

#### 3.1 JWKS (JSON Web Key Set) 조회
JWT 토큰 검증을 위한 공개키를 조회합니다.

```
GET /jwks
```

**Response:**
```typescript
{
  keys: JWK[];
}
```

**Example Request:**
```
GET /jwks
```

**Note:** 이 엔드포인트는 인증 없이 접근 가능합니다.

---

## Event Server APIs

### Base URL
```
http://localhost:3002
```

### 1. User APIs (일반 사용자)

#### 1.1 이벤트 목록 조회
현재 진행 중이거나 예정된 이벤트 목록을 조회합니다.

```
GET /event/user/events
```

**Required Role:** USER 이상

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| isActive | boolean | No | - | 활성화된 이벤트만 조회 |
| page | number | No | 1 | 페이지 번호 (1부터 시작) |
| pageSize | number | No | 20 | 페이지당 항목 수 |

**Response:**
```typescript
{
  events: EventResponseDto[];
  total: number;
  page: number;
  pageSize: number;
}

// EventResponseDto
{
  id: string;
  title: string;
  description: string;
  conditions: EventConditionResponse[];
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

// EventConditionResponse
{
  activityType: string;      // 활동 유형
  targetCount: number;       // 목표 횟수
  startDate: Date;          // 조건 시작일
  endDate: Date;            // 조건 종료일
  description: string;      // 조건 설명
}
```

---

#### 1.2 이벤트별 보상 조회
특정 이벤트에 설정된 보상 목록을 조회합니다.

```
GET /event/user/events/:eventId/rewards
```

**Required Role:** USER 이상

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| eventId | string | Yes | 이벤트 ID |

**Response:**
```typescript
{
  rewards: RewardResponseDto[];
}

// RewardResponseDto
{
  id: string;
  type: 'point' | 'item' | 'coupon';
  name: string;
  quantity: number;
  eventId: string;
}
```

---

#### 1.3 보상 요청
이벤트 조건을 충족한 경우 보상을 요청합니다.

```
POST /event/user/events/:eventId/rewards
```

**Required Role:** USER 이상

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| eventId | string | Yes | 이벤트 ID |

**Headers:**
| Header | Type | Required | Description |
|--------|------|----------|-------------|
| userid | string | Yes | 사용자 ID |

**Response:**
```typescript
{
  requestId: string;
  eventId: string;
  userId: string;
  status: 'SUCCESS' | 'FAILED';
  requestedAt: Date;
}
```

**Business Logic:**
- 이벤트 조건을 모두 충족해야 SUCCESS
- 이미 성공한 요청이 있으면 새 요청은 FAILED
- 모든 요청은 성공/실패와 관계없이 기록

---

#### 1.4 유저 보상 요청 이력 조회
본인의 보상 요청 이력을 조회합니다.

```
GET /event/user/reward-requests
```

**Required Role:** USER 이상

**Headers:**
| Header | Type | Required | Description |
|--------|------|----------|-------------|
| userid | string | Yes | 사용자 ID |

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | number | No | 1 | 페이지 번호 |
| pageSize | number | No | 20 | 페이지당 항목 수 |

**Response:**
```typescript
{
  requestHistory: UserRewardRequestHistoryDto[];
  total: number;
  page: number;
  pageSize: number;
}
```

---

### 2. Operator APIs (운영자)

#### 2.1 이벤트 등록
새로운 이벤트를 생성합니다.

```
POST /event/operator/events
```

**Required Role:** OPERATOR

**Request Body:**
```typescript
{
  title: string;
  description: string;
  conditions: EventConditionDto[];
  startDate: string;
  endDate: string;
  isActive: boolean;
}

// EventConditionDto
{
  activityType: string;    // 'login', 'friend_invite', 'quest_complete' 등
  targetCount: number;     // 목표 횟수
  startDate: Date;        // 조건 측정 시작일
  endDate: Date;          // 조건 측정 종료일
  description: string;    // 조건 설명
}
```

**Example Request:**
```json
POST /event/operator/events
Authorization: Bearer <operator_jwt_token>
Content-Type: application/json

{
  "title": "신년 특별 이벤트",
  "description": "2024년 새해 맞이 이벤트",
  "conditions": [
    {
      "activityType": "login",
      "targetCount": 7,
      "startDate": "2024-01-01T00:00:00.000Z",
      "endDate": "2024-01-31T23:59:59.999Z",
      "description": "7일 연속 로그인"
    }
  ],
  "startDate": "2024-01-01T00:00:00.000Z",
  "endDate": "2024-01-31T23:59:59.999Z",
  "isActive": true
}
```

---

#### 2.2 보상 등록
이벤트에 보상을 추가합니다.

```
POST /event/operator/events/:eventId/rewards
```

**Required Role:** OPERATOR

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| eventId | string | Yes | 이벤트 ID |

**Request Body:**
```typescript
{
  type: 'point' | 'item' | 'coupon';
  name: string;
  quantity: number;
}
```

---

### 3. Auditor APIs (감사자)

#### 3.1 전체 보상 요청 기록 조회
시스템 전체의 보상 요청 기록을 조회합니다.

```
GET /event/auditor/reward-requests
```

**Required Role:** AUDITOR

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| eventId | string | No | - | 특정 이벤트 필터링 |
| status | string | No | - | 상태별 필터링 |
| userId | string | No | - | 특정 사용자 필터링 |
| page | number | No | 1 | 페이지 번호 |
| pageSize | number | No | 20 | 페이지당 항목 수 |

**Response:**
```typescript
{
  requestHistory: SearchRewardRequestHistoryDto[];
  total: number;
  page: number;
  pageSize: number;
}
```

---

## Error Handling

### Error Response Format
```typescript
{
  name: string;
  code: string;
  message: string;
  httpStatusCode: number;
}
```

### Common Error Codes

#### Auth Server Errors
| Code | Name | Message | HTTP Status |
|------|------|---------|-------------|
| A102 | DUPLICATE_USER_ID | 이미 존재하는 사용자 ID입니다. | 400 |
| A102 | UNAUTHORIZED | 인증되지 않은 사용자입니다. | 401 |

#### Event Server Errors
| Code | Name | Message | HTTP Status |
|------|------|---------|-------------|
| E001 | EVENT_NOT_FOUND | 이벤트를 찾을 수 없습니다. | 404 |
| E002 | EVENT_NOT_IN_PERIOD | 이벤트 기간이 아닙니다. | 400 |
| E003 | EVENT_NOT_ACTIVE | 활성화되지 않은 이벤트입니다. | 400 |

---

## Integration Guide

### 인증 플로우
1. Auth Server에서 로그인 (`/auth/login`)
2. 발급받은 JWT 토큰을 Authorization 헤더에 포함
3. Event Server API 호출 시 토큰 사용

### 이벤트 참여 플로우
1. 이벤트 목록 조회 (`/event/user/events`)
2. 이벤트 상세 및 보상 확인 (`/event/user/events/:eventId/rewards`)
3. 조건 충족 후 보상 요청 (`/event/user/events/:eventId/rewards`)
4. 보상 요청 이력 확인 (`/event/user/reward-requests`)

### 이벤트 관리 플로우
1. 이벤트 생성 (`/event/operator/events`)
2. 보상 등록 (`/event/operator/events/:eventId/rewards`)
3. 이벤트 활성화 (이벤트 생성 시 isActive 설정)
4. 보상 요청 모니터링 (`/event/auditor/reward-requests`)

---

## Best Practices

1. **토큰 관리**
   - JWT 토큰은 안전하게 저장
   - 토큰 만료 시 재로그인 필요
   - 토큰은 클라이언트 측에서 관리

2. **에러 처리**
   - 모든 API 호출에 대해 에러 처리 구현
   - 에러 코드별로 적절한 사용자 메시지 표시
   - 네트워크 에러와 비즈니스 로직 에러 구분

3. **페이지네이션**
   - 대량 데이터 조회 시 페이지네이션 활용
   - 적절한 pageSize 설정 (기본값: 20)
   - 프론트엔드에서 무한 스크롤 구현 가능

4. **보안**
   - HTTPS 사용 권장
   - 민감한 정보는 헤더나 바디에만 포함
   - 권한별 API 접근 제한 준수