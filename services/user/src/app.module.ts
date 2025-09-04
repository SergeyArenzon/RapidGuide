import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { microOrmConfig } from 'src/config';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { LanguagesModule } from './languages/languages.module';
import { CountryModule } from './country/country.module';
import { CityModule } from './city/city.module';
import { GuideModule } from './guide/guide.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from './config';
@Module({
  imports: [
    MikroOrmModule.forRoot(microOrmConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    UserModule,
    LanguagesModule,
    CountryModule,
    CityModule,
    GuideModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
