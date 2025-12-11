import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { microOrmConfig } from 'src/config';
import { AppController } from './app.controller';
import { LanguagesModule } from './languages/languages.module';
import { CountryModule } from './country/country.module';
import { CityModule } from './city/city.module';
import { GuideModule } from './guide/guide.module';
import { ProfileModule } from './profile/profile.module';
import { APP_GUARD, APP_INTERCEPTOR, Reflector } from '@nestjs/core';
import { ZodResponseInterceptor } from '@rapid-guide-io/interceptors';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import auth from './better-auth';
import { JwtAuthGuard, JwtAuthGuardOptions } from '@rapid-guide-io/guards';

@Module({
  imports: [
    AuthModule.forRoot({ auth, disableGlobalAuthGuard: true }),
    MikroOrmModule.forRoot(microOrmConfig),
    ProfileModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useFactory: (reflector: Reflector) => {
        const options: JwtAuthGuardOptions = {
          audience: 'profile-svc',
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
