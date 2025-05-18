import { Injectable } from '@nestjs/common';
import { importJWK, JWK, SignJWT } from 'jose';
import { ConfigService } from '@nestjs/config';
import { Role } from "../../role/role";

@Injectable()
export class JwtProvider {

  private readonly jwkPrivateKey: JWK;
  private readonly encodedJwtPrivateKeyPromise: Promise<CryptoKey | Uint8Array>;

  constructor(private readonly configService: ConfigService) {
    const rawJwkPrivateKey = configService.get<string>('JWKS_PRIVATE_KEY');
    this.jwkPrivateKey = JSON.parse(rawJwkPrivateKey) as JWK;
    this.encodedJwtPrivateKeyPromise = importJWK(this.jwkPrivateKey, 'EdDSA');
  }

  public async generateToken(userId: string, role: Role): Promise<string> {
    return await new SignJWT({
      userId,
      role,
    })
      .setProtectedHeader({
        alg: this.jwkPrivateKey.alg,
        typ: 'JWT',
      })
      .setAudience(userId)
      .setExpirationTime('100h')
      .sign(await this.encodedJwtPrivateKeyPromise);
  }

  public getJwks(): { keys: JWK[] } {

    return {
      keys: [
        {
          kid: this.jwkPrivateKey.kid,
          kty: this.jwkPrivateKey.kty,
          use: this.jwkPrivateKey.use,
          alg: this.jwkPrivateKey.alg,
          crv: this.jwkPrivateKey.crv,
          x: this.jwkPrivateKey.x,
          y: this.jwkPrivateKey.y,
        },
      ],
    };
  }
}
