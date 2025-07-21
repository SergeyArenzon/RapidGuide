import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { microOrmConfig } from 'src/config';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { LanguagesModule } from './languages/languages.module';
import { CountryModule } from './country/country.module';
import { CityModule } from './city/city.module';
import { GuideModule } from './guide/guide.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(microOrmConfig),
    // ClientsModule.register(rabbitMqConfig),
    UserModule,
    LanguagesModule,
    CountryModule,
    CityModule,
    GuideModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
