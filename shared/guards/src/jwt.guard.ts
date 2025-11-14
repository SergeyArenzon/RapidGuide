// libs/shared-auth/src/jwt-auth.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { createRemoteJWKSet, jwtVerify, JWTVerifyOptions } from 'jose';
import { IS_PUBLIC_KEY } from '@rapid-guide-io/decorators';

export interface JwtAuthGuardOptions {
  audience: string | string[];
  verifyOptions?: Omit<JWTVerifyOptions, 'audience' | 'issuer'>;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly jwks: ReturnType<typeof createRemoteJWKSet>;
  private readonly verifyOptions: JWTVerifyOptions;

  constructor(
    private readonly reflector: Reflector,
    private readonly options: JwtAuthGuardOptions,
  ) {
    this.jwks = createRemoteJWKSet(new URL('http://auth:3000/auth/jwks'));
    this.verifyOptions = {
      audience: options.audience,
      issuer: 'auth-svc',
      ...options.verifyOptions,
    };
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'];

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing or invalid Authorization header',
      );
    }

    const token = authHeader.split(' ')[1];

    try {
      const { payload } = await jwtVerify(token, this.jwks, this.verifyOptions);
      req.user = {
        id: payload.id,
        email: payload.email,
        scopes: payload.scopes,
        roles: payload.roles,
      };
      return true;
    } catch (err) {
      console.log({ err });

      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
