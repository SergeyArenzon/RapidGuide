// src/redis/redis.module.ts
import { Module, Global, DynamicModule } from '@nestjs/common';
import Redis, { RedisOptions } from 'ioredis';
import { RedisService } from './redis.service';

@Global()
@Module({})
export class RedisModule {
  static forRoot(options?: RedisOptions): DynamicModule {
    const redisConfig = {
      host: 'redis-master',
      port: 6379,
      password:  "redis",
      db: parseInt(process.env.REDIS_DB || '0', 10)
    };
    
    console.log('Redis config:', redisConfig);
    
    const redisProvider = {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        
        const client = new Redis({
          ...redisConfig,
          retryStrategy(times) {
            return Math.min(times * 50, 2000); // Reconnect delay
          },
          ...options,
        });

        client.on('connect', () => console.log('✅ Redis connected'));
        client.on('error', (err) => console.error('❌ Redis error', err));

        return client;
      },
    };

    return {
      module: RedisModule,
      providers: [redisProvider, RedisService],
      exports: [redisProvider, RedisService],
    };
  }
}
