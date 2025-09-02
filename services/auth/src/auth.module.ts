import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenModule } from './access-token/access-token.module';
import { LoggerMiddleware } from './logger.middleware';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { RedisModule } from '@rapid-guide-io/redis';

@Module({
  imports: [
    AccessTokenModule,
    RefreshTokenModule,
    RedisModule.forRoot({
      host: process.env.REDIS_HOST ,
      port: parseInt(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
      db: parseInt(process.env.REDIS_DB)
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(LoggerMiddleware).forRoutes('*');
  // }
}
