import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ROLES_KEY } from 'src/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // No roles required
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

    if (!payload.roles || !Array.isArray(payload.roles)) {
      this.logger.warn('No roles found in user token');
      throw new ForbiddenException('No roles assigned to user');
    }

    const allowedUserRoles = payload.roles.filter(role => 
      requiredRoles.includes(role)
    );

    if (allowedUserRoles.length === 0) {
      this.logger.warn(`User ${payload.sub} lacks required roles: ${requiredRoles.join(', ')}. User roles: ${payload.roles.join(', ')}`);
      throw new ForbiddenException('Insufficient role permissions');
    }

    // Set user info on request for controllers to use
    request['subject'] = payload.sub;
    request['roles'] = allowedUserRoles;

    return true;
  }
}
