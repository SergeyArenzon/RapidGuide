import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { SCOPES_KEY } from 'src/decorators/scope.decorator';
  
  @Injectable()
  export class ScopesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
  
    canActivate(context: ExecutionContext): boolean {
      const requiredScopes = this.reflector.getAllAndOverride<string[]>(
        SCOPES_KEY,
        [context.getHandler(), context.getClass()],
      );
  
      if (!requiredScopes || requiredScopes.length === 0) {
        return true; // No scopes required
      }
  
      const request = context.switchToHttp().getRequest();
      const user = request.user; // comes from your JWT validation step
  
      if (!user?.scopes) {
        throw new ForbiddenException('No scopes in token');
      }
  
      const hasScope = requiredScopes.every(scope =>
        user.scopes.includes(scope),
      );
  
      if (!hasScope) {
        throw new ForbiddenException('Insufficient scope');
      }
  
      return true;
    }
  }
  