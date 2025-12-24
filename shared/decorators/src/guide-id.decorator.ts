import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const GuideId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const req = ctx.switchToHttp().getRequest<Request & { user?: { guide_id?: string } }>();
    if (!req.user) {
      throw new Error('User not found on request. Make sure JwtAuthGuard is applied.');
    }
    if (!req.user.guide_id) {
      throw new Error('Guide ID not found in JWT token. User may not have a guide profile.');
    }
    return req.user.guide_id;
  },
);

