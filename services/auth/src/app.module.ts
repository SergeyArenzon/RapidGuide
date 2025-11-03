import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccessTokenModule } from './access-token/access-token.module';
import { LoggerMiddleware } from './logger.middleware';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { RedisModule } from '@rapid-guide-io/redis';
import { AuthModule } from './auth/auth.module';
import mikroOrmConfig from 'src/mikro-orm.config';

@Module({
  imports: [
    // MikroORM setup
    MikroOrmModule.forRoot(mikroOrmConfig),
    // Better Auth module
    AuthModule,
    // Existing modules (keep for backward compatibility during migration)
    AccessTokenModule,
    RefreshTokenModule,
    RedisModule.forRoot({
      host: process.env.REDIS_HOST ,
      port: parseInt(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
      db: parseInt(process.env.REDIS_DB)
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(LoggerMiddleware).forRoutes('*');
  // }
}
