import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Subject = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.subject as string;
  },
);
