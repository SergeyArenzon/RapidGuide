import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ZodType } from 'zod';
import { RESPONSE_SCHEMA_KEY } from '@rapid-guide-io/decorators';

@Injectable()
export class ZodResponseInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const schema = this.reflector.get<ZodType<any>>(
      RESPONSE_SCHEMA_KEY,
      context.getHandler(),
    );

    if (!schema) {
      return next.handle(); // no schema defined → skip validation
    }

    return next.handle().pipe(
      map((data) => {
        const result = schema.safeParse(data);

        if (!result.success) {
          throw new InternalServerErrorException({
            statusCode: 500,
            message: 'Response validation failed',
            errors: result.error.issues,
          });
        }

        return result.data; // ✅ validated & typed
      }),
    );
  }
}
