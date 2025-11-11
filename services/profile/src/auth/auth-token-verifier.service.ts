import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JWTPayload, JWTVerifyOptions, createRemoteJWKSet, jwtVerify } from 'jose';

@Injectable()
export class AuthTokenVerifier {
  private readonly logger = new Logger(AuthTokenVerifier.name);
  private readonly jwks = createRemoteJWKSet(this.resolveJwksUrl());
  private readonly verifyOptions: JWTVerifyOptions = this.resolveVerifyOptions();

  async verify(token: string): Promise<JWTPayload> {
    try {
      const { payload } = await jwtVerify(token, this.jwks, this.verifyOptions);
      return payload;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown verification error';
      this.logger.warn(`Access token verification failed: ${message}`);
      throw new UnauthorizedException('Invalid access token');
    }
  }

  private resolveJwksUrl(): URL {
    const url =
      process.env.AUTH_JWKS_URL ??
      'http://localhost:80/api/v1/auth/auth/.well-known/jwks.json';

    try {
      return new URL(url);
    } catch {
      throw new Error(
        `Invalid AUTH_JWKS_URL value. Received "${url}", expected valid URL.`,
      );
    }
  }

  private resolveVerifyOptions(): JWTVerifyOptions {
    const options: JWTVerifyOptions = {};

    if (process.env.AUTH_ISSUER) {
      options.issuer = process.env.AUTH_ISSUER;
    }

    if (process.env.AUTH_AUDIENCE) {
      options.audience = process.env.AUTH_AUDIENCE;
    }

    return options;
  }
}

