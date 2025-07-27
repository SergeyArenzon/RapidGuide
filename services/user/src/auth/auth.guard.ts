import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  // Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from './decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  // private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      // this.logger.debug('Endpoint is public, skipping auth');
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      // this.logger.warn('No token provided in request');
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      // this.logger.log(`Token verified for user: ${JSON.stringify(payload)}`);
      
      // Attach user to request object
      request['user'] = payload;
    } catch (error) {
      console.log('error', error);
      
      // this.logger.error(`Token verification failed: ${error.message}`);
      throw new UnauthorizedException(
        error.name === 'TokenExpiredError'
          ? 'Token has expired'
          : 'Invalid token',
      );
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
