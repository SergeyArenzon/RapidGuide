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
    const requiredScopes =
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

    const hasAllRequiredScopes = requiredScopes.every((scope) =>
      scopes.includes(scope),
    );

    if (!hasAllRequiredScopes) {
      throw new ForbiddenException('Insufficient scope');
    }

    return true;
  }
}
