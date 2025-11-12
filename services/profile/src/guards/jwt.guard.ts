// libs/shared-auth/src/jwt-auth.guard.ts
import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
  } from '@nestjs/common'
  import { createRemoteJWKSet, jwtVerify } from 'jose'
  
  const JWKS = createRemoteJWKSet(new URL(`${process.env.BASE_URL}/auth/auth/.well-known/jwks.json`))   
  @Injectable()
  export class JwtAuthGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const req = context.switchToHttp().getRequest()
      const authHeader = req.headers['authorization']
  
      if (!authHeader?.startsWith('Bearer ')) {
        throw new UnauthorizedException('Missing or invalid Authorization header')
      }
  
      const token = authHeader.split(' ')[1]
  
      try {
        const { payload } = await jwtVerify(token, JWKS, {
          issuer: `${process.env.BASE_URL}`,
        })
  
        req.user = payload
        return true
      } catch (err) {
        throw new UnauthorizedException('Invalid or expired token')
      }
    }
  }
  