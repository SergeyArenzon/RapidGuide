import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { SCOPES_KEY } from '@rapid-guide-io/decorators';
import { verifyJwtToken } from './jwt-utils';
  
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
      const payload = await verifyJwtToken(request, this.jwtService, this.logger);
  
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
  