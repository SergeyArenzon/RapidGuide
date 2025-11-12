import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { microOrmConfig } from 'src/config';
import { AppController } from './app.controller';
import { LanguagesModule } from './languages/languages.module';
import { CountryModule } from './country/country.module';
import { CityModule } from './city/city.module';
import { GuideModule } from './guide/guide.module';
import { APP_INTERCEPTOR, Reflector } from '@nestjs/core';
import { ZodResponseInterceptor } from '@rapid-guide-io/interceptors';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import auth from './better-auth';

@Module({
  imports: [
    AuthModule.forRoot({ auth, disableGlobalAuthGuard: true }),
    MikroOrmModule.forRoot(microOrmConfig),
    LanguagesModule,
    CountryModule,
    CityModule,
    GuideModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useFactory: (reflector: Reflector) =>
        new ZodResponseInterceptor(reflector),
      inject: [Reflector],
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
