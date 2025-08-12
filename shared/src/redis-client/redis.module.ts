import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule as NestRedisModule } from '@nestjs-modules/ioredis';
import { RedisService } from './redis.service';
import { createRedisConfig } from './redis.config';

@Module({
  imports: [
    NestRedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const config = createRedisConfig();
        return {
          config: {
            ...config,
            host: configService.get('REDIS_HOST', config.host),
            port: configService.get('REDIS_PORT', config.port),
            password: configService.get('REDIS_PASSWORD', config.password),
            db: configService.get('REDIS_DB', config.db),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
