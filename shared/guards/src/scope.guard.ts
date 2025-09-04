import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
    UnauthorizedException,
    Logger,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { JwtService } from '@nestjs/jwt';
  import { Request } from 'express';
  import { SCOPES_KEY } from '@rapid-guide-io/decorators';
  
  @Injectable()
  export class ScopesGuard implements CanActivate {
    private readonly logger = new Logger(ScopesGuard.name);

    constructor(
      private reflector: Reflector,
      private jwtService: JwtService,
    ) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const requiredScopes = this.reflector.getAllAndOverride<string[]>(
        SCOPES_KEY,
        [context.getHandler(), context.getClass()],
      );
  
      if (!requiredScopes || requiredScopes.length === 0) {
        return true; // No scopes required
      }
  
      const request = context.switchToHttp().getRequest<Request>();
      const accessToken = request.cookies.accessToken;

      if (!accessToken) {
        throw new UnauthorizedException('No token provided');
      }

      let payload: any;
      try {
        payload = await this.jwtService.verifyAsync(accessToken);
        this.logger.log(`Token verified for user: ${payload.sub}`);
      } catch (error) {
        this.logger.error(`Token verification failed: ${error.message}`);
        throw new UnauthorizedException(
          error.name === 'TokenExpiredError'
            ? 'Token has expired'
            : 'Invalid token',
        );
      }
  
      if (!payload.scopes || !Array.isArray(payload.scopes)) {
        throw new ForbiddenException('No scopes in token');
      }
  
      const hasScope = requiredScopes.every(scope =>
        payload.scopes.includes(scope),
      );
  
      if (!hasScope) {
        this.logger.warn(`User ${payload.sub} lacks required scopes: ${requiredScopes.join(', ')}. User scopes: ${payload.scopes.join(', ')}`);
        throw new ForbiddenException('Insufficient scope');
      }

      request['scopes'] = payload.scopes;
  
      this.logger.log(`Scope check passed for user ${payload.sub} with scopes: ${payload.scopes.join(', ')}`);
      return true;
    }
  }
  