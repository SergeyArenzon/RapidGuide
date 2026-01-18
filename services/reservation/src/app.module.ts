import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import microOrmConfig from './mikro-orm.config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ReservationModule } from './reservation/reservation.module';
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
    ReservationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useFactory: (reflector: Reflector) => {
        const options: JwtAuthGuardOptions = {
          audience: 'reservation-svc',
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
export class AppModule {}
