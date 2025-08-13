// src/redis/redis.module.ts
import { Module, Global, DynamicModule } from '@nestjs/common';
import Redis, { RedisOptions } from 'ioredis';
import { RedisService } from './redis.service';

export interface RedisModuleOptions extends Partial<Omit<RedisOptions, 'retryStrategy'>> {
  host?: string;
  port?: number;
  password?: string;
  db?: number;
  retryStrategy?: (times: number) => number | void;
  enableLogging?: boolean;
}

@Global()
@Module({})
export class RedisModule {
  static forRoot(options: RedisModuleOptions): DynamicModule {
    if (!options.host || !options.port) {
      throw new Error('Redis configuration must include host and port');
    }

    const redisConfig = { ...options };
    

    
    const redisProvider = {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        const client = new Redis({
          ...redisConfig,
          retryStrategy: redisConfig.retryStrategy || ((times) => Math.min(times * 50, 2000)),
        } as RedisOptions);

      
        client.on('connect', () => console.log('✅ Redis connected'));
        client.on('error', (err) => console.error('❌ Redis error', err));
        client.on('ready', () => console.log('🚀 Redis ready'));
        client.on('close', () => console.log('🔌 Redis connection closed'));
      

        return client;
      },
    };

    return {
      module: RedisModule,
      providers: [redisProvider, RedisService],
      exports: [redisProvider, RedisService],
    };
  }

  static forRootAsync(options: {
    useFactory: (...args: any[]) => Promise<RedisModuleOptions> | RedisModuleOptions;
    inject?: any[];
  }): DynamicModule {
    const redisProvider = {
      provide: 'REDIS_CLIENT',
      useFactory: async (...args: any[]) => {
        const config = await options.useFactory(...args);
        
        if (!config.host || !config.port) {
          throw new Error('Redis configuration must include host and port');
        }

        const redisConfig = { ...config };
        
        console.log('Redis config:', {
          host: redisConfig.host,
          port: redisConfig.port,
          db: redisConfig.db,
          password: redisConfig.password ? '[REDACTED]' : undefined,
        });
        
        const client = new Redis({
          ...redisConfig,
          retryStrategy: redisConfig.retryStrategy || ((times) => Math.min(times * 50, 2000)),
        } as RedisOptions);

        if (redisConfig.enableLogging) {
          client.on('connect', () => console.log('✅ Redis connected'));
          client.on('error', (err) => console.error('❌ Redis error', err));
          client.on('ready', () => console.log('🚀 Redis ready'));
          client.on('close', () => console.log('🔌 Redis connection closed'));
        }

        return client;
      },
      inject: options.inject || [],
    };

    return {
      module: RedisModule,
      providers: [redisProvider, RedisService],
      exports: [redisProvider, RedisService],
    };
  }
}
