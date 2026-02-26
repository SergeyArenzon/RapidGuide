import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { microOrmConfig } from 'src/config';
import { AppController } from './app.controller';
import { ProfileModule } from './profile/profile.module';
import { APP_GUARD, APP_INTERCEPTOR, Reflector } from '@nestjs/core';
import { ZodResponseInterceptor } from '@rapid-guide-io/interceptors';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { betterAuth } from 'better-auth';
import { jwt } from 'better-auth/plugins';
import { JwtAuthGuard, JwtAuthGuardOptions } from '@rapid-guide-io/guards';

@Module({
  imports: [
    AuthModule.forRoot({
      auth: betterAuth({
        plugins: [jwt()],
      }),
      disableGlobalAuthGuard: true,
    }),
    MikroOrmModule.forRoot(microOrmConfig),
    ProfileModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useFactory: (reflector: Reflector) => {
        const options: JwtAuthGuardOptions = {
          audience: 'user-svc',
        };
        return new JwtAuthGuard(reflector, options);
      },
      inject: [Reflector],
    },
    {
      provide: APP_INTERCEPTOR,
      useFactory: (reflector: Reflector) =>
        new ZodResponseInterceptor(reflector),
      inject: [Reflector],
    },
  ],
})
export class AppModule implements NestModule {
  configure(_consumer: MiddlewareConsumer) {
    // consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
