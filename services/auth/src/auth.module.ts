import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AccessTokenService } from './access-token.service';
import { LoggerMiddleware } from './logger.middleware';
import { JwtModule } from '@nestjs/jwt';
import { RefreshTokenService } from './refresh-token.service';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' }, // Optional expiration
    }),
    RedisModule.forRoot(),
  ],
  controllers: [AuthController],
  providers: [AccessTokenService, RefreshTokenService],
})
export class AuthModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(LoggerMiddleware).forRoutes('*');
  // }
}
