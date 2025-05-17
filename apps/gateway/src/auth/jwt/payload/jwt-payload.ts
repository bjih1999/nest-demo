export class JwtPayload {
  sub: string; // 사용자 ID
  iss: string; // 발급자
  aud: string; // 수신자
  exp: number; // 만료 시간
  iat: number; // 발급 시간
  jti: string; // JWT ID
  role: string; // 사용자 역할
}