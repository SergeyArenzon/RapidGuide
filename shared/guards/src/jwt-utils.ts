import { UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

/**
 * Shared JWT token verification utility
 */
export async function verifyJwtToken(
  request: Request,
  jwtService: JwtService,
  logger: Logger,
): Promise<any> {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new UnauthorizedException('No token provided');
  }

  // Extract token from "Bearer <token>" format
  const token = authHeader.startsWith('Bearer ') 
    ? authHeader.slice(7) 
    : authHeader;

  if (!token) {
    throw new UnauthorizedException('Invalid authorization header format');
  }

  let payload: any;
  try {
    payload = await jwtService.verifyAsync(token);
    logger.log(`Token verified for user: ${payload.sub}`);
  } catch (error) {
    logger.error(`Token verification failed: ${error.message}`);
    throw new UnauthorizedException(
      error.name === 'TokenExpiredError'
        ? 'Token has expired'
        : 'Invalid token',
    );
  }

  return payload;
}
