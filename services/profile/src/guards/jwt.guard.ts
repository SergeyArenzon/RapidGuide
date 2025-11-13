// libs/shared-auth/src/jwt-auth.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

const JWKS = createRemoteJWKSet(new URL(`http://auth:3000/auth/jwks`));

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

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
      const { payload } = await jwtVerify(token, JWKS, {
        audience: 'profile-svc',
        issuer: 'auth-svc',
      });
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
