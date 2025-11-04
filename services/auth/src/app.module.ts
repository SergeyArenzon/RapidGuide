import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccessTokenModule } from './access-token/access-token.module';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { RedisModule } from '@rapid-guide-io/redis';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import mikroOrmConfig from 'src/mikro-orm.config';
import { createAuth } from './better-auth';
import { MikroORM } from '@mikro-orm/core';

@Module({
  imports: [
    // MikroORM setup
    MikroOrmModule.forRoot(mikroOrmConfig),
    // Better Auth module
    // AuthModule.forRootAsync({
    //   useFactory: (orm: MikroORM) => {
    //     return { auth: createAuth(orm) };
    //   },
    //   inject: [MikroORM],
    // }),
    // Existing modules (keep for backward compatibility during migration)
    AccessTokenModule,
    RefreshTokenModule,
    RedisModule.forRoot({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
      db: parseInt(process.env.REDIS_DB),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
