import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccessTokenModule } from './access-token/access-token.module';
import { LoggerMiddleware } from './logger.middleware';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { RedisModule } from '@rapid-guide-io/redis';
import { AuthModule } from '@thallesp/nestjs-better-auth';

import { auth } from './auth.config';
import mikroOrmConfig from '../mikro-orm.config';
import { Account } from './entities/account.entity';
import { Session } from './entities/session.entity';
import { User } from './entities/user.entity';
import { Verification } from './entities/verification.entity';

@Module({
  imports: [
    // MikroORM setup
    MikroOrmModule.forRoot(mikroOrmConfig),
    MikroOrmModule.forFeature([User, Session, Account, Verification]),
    // Better Auth integration
    AuthModule.forRoot({
      auth,
    }),
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
