import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SCOPES_KEY } from '@rapid-guide-io/decorators';

@Injectable()
export class ScopesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    let requiredScopes =
      this.reflector.getAllAndOverride<string[]>(SCOPES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? [];

    if (requiredScopes.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const scopes: unknown =
      request.scopes ?? request.user?.scopes ?? request.user?.permissions;

    if (!Array.isArray(scopes)) {
      throw new ForbiddenException('No scopes on authenticated user');
    }

    const hasAllRequiredScopes = requiredScopes.every((requiredScope) => {
      // Direct match
      if (scopes.includes(requiredScope)) {
        return true;
      }

      // Wildcard support: check if user has 'resource:*' when 'resource:action' is required
      const [resource, action] = requiredScope.split(':');
      if (resource && action) {
        const wildcardScope = `${resource}:*`;
        if (scopes.includes(wildcardScope)) {
          return true;
        }
      }

      // Reverse wildcard: check if user has 'resource:action' when 'resource:*' is required
      // (less common, but useful for granular checks)
      if (requiredScope.endsWith(':*')) {
        const resourcePrefix = requiredScope.replace(':*', '');
        return scopes.some((scope) => scope.startsWith(`${resourcePrefix}:`));
      }

      return false;
    });

    if (!hasAllRequiredScopes) {
      throw new ForbiddenException('Insufficient scope');
    }

    return true;
  }
}
