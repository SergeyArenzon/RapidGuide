import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const TravellerId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const req = ctx.switchToHttp().getRequest<Request & { user?: { traveller_id?: string } }>();
    if (!req.user) {
      throw new Error('User not found on request. Make sure JwtAuthGuard is applied.');
    }
    if (!req.user.traveller_id) {
      throw new Error('Traveller ID not found in JWT token. User may not have a traveller profile.');
    }
    return req.user.traveller_id;
  },
);

