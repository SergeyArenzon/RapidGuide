# Redis Client for NestJS Microservices

This Redis client provides a comprehensive Redis integration for NestJS microservices with connection management, health checks, and a full set of Redis operations.

## Features

- **Connection Management**: Automatic connection handling with retry logic
- **Health Checks**: Built-in health monitoring for Redis connections
- **Comprehensive Operations**: Support for all major Redis data types and operations
- **Error Handling**: Robust error handling with logging
- **Configuration**: Flexible configuration through environment variables
- **TypeScript Support**: Full TypeScript support with proper types

## Installation

The Redis client is included in the `@rapid-guide-io/shared` package. Make sure you have the following dependencies in your microservice:

```bash
pnpm add @nestjs-modules/ioredis ioredis
```

## Configuration

### Environment Variables

Set the following environment variables in your microservice:

```bash
# Redis Connection
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_password
REDIS_DB=0

# Optional Configuration
REDIS_KEY_PREFIX=your_prefix
REDIS_CONNECTION_NAME=your_service_name
```

### Kubernetes Configuration

For Kubernetes deployments, add Redis configuration to your values.yaml:

```yaml
env:
  REDIS_HOST: "redis.default.svc.cluster.local"
  REDIS_PORT: "6379"
  REDIS_PASSWORD: "your_password"
  REDIS_DB: "0"
```

## Usage

### 1. Import the Redis Module

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '@rapid-guide-io/shared';

@Module({
  imports: [
    ConfigModule.forRoot(),
    RedisModule,
  ],
  // ... other module configuration
})
export class AppModule {}
```

### 2. Inject and Use Redis Service

```typescript
import { Injectable } from '@nestjs/common';
import { RedisService } from '@rapid-guide-io/shared';

@Injectable()
export class UserService {
  constructor(private readonly redisService: RedisService) {}

  async cacheUser(userId: string, userData: any): Promise<void> {
    // Cache user data with TTL
    await this.redisService.set(`user:${userId}`, JSON.stringify(userData), 3600);
  }

  async getUser(userId: string): Promise<any | null> {
    const userData = await this.redisService.get(`user:${userId}`);
    return userData ? JSON.parse(userData) : null;
  }

  async getUserProfile(userId: string): Promise<Record<string, string>> {
    // Using hash operations
    return await this.redisService.hgetall(`user:profile:${userId}`);
  }

  async addUserToSet(setKey: string, userId: string): Promise<number> {
    // Using set operations
    return await this.redisService.sadd(setKey, userId);
  }
}
```

### 3. Health Checks

```typescript
import { Controller, Get } from '@nestjs/common';
import { RedisHealthIndicator } from '@rapid-guide-io/shared';

@Controller('health')
export class HealthController {
  constructor(private readonly redisHealthIndicator: RedisHealthIndicator) {}

  @Get('redis')
  async checkRedisHealth() {
    return await this.redisHealthIndicator.isHealthy('redis');
  }

  @Get('redis/detailed')
  async checkRedisHealthDetailed() {
    return await this.redisHealthIndicator.isHealthyWithDetails('redis');
  }
}
```

## Available Operations

### Basic Operations
- `get(key)`, `set(key, value, ttl?)`, `del(key)`, `exists(key)`

### Hash Operations
- `hget(key, field)`, `hset(key, field, value)`, `hgetall(key)`, `hdel(key, ...fields)`

### List Operations
- `lpush(key, ...values)`, `rpush(key, ...values)`, `lpop(key)`, `rpop(key)`, `lrange(key, start, stop)`

### Set Operations
- `sadd(key, ...members)`, `srem(key, ...members)`, `smembers(key)`, `sismember(key, member)`

### Sorted Set Operations
- `zadd(key, score, member)`, `zrange(key, start, stop, withScores?)`, `zscore(key, member)`

### Utility Operations
- `keys(pattern)`, `expire(key, seconds)`, `ttl(key)`, `flushdb()`, `ping()`

## Advanced Usage

### Custom Configuration

```typescript
import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';
import { createRedisConfig } from '@rapid-guide-io/shared';

@Module({
  imports: [
    RedisModule.forRoot({
      config: createRedisConfig(),
    }),
  ],
})
export class CustomRedisModule {}
```

### Direct Redis Instance Access

```typescript
import { Injectable } from '@nestjs/common';
import { RedisService } from '@rapid-guide-io/shared';
import Redis from 'ioredis';

@Injectable()
export class AdvancedRedisService {
  constructor(private readonly redisService: RedisService) {}

  async executeCustomCommand(): Promise<any> {
    const redis: Redis = this.redisService.getRedisInstance();
    
    // Execute custom Redis commands
    const result = await redis.eval(`
      local key = KEYS[1]
      local value = ARGV[1]
      return redis.call('SET', key, value)
    `, 1, 'custom:key', 'custom:value');
    
    return result;
  }
}
```

## Error Handling

The Redis service includes comprehensive error handling:

```typescript
try {
  const result = await this.redisService.set('key', 'value');
  console.log('Success:', result);
} catch (error) {
  console.error('Redis operation failed:', error.message);
  // Handle error appropriately
}
```

## Best Practices

1. **Connection Management**: The service automatically handles connections and cleanup
2. **Error Handling**: Always wrap Redis operations in try-catch blocks
3. **TTL Usage**: Set appropriate TTL values for cached data
4. **Key Naming**: Use consistent key naming conventions (e.g., `service:entity:id`)
5. **Health Monitoring**: Implement health checks in your microservice
6. **Configuration**: Use environment variables for Redis configuration

## Troubleshooting

### Common Issues

1. **Connection Refused**: Check Redis host, port, and network connectivity
2. **Authentication Failed**: Verify Redis password configuration
3. **Timeout Errors**: Adjust connection timeout settings in configuration
4. **Memory Issues**: Monitor Redis memory usage and implement proper TTL

### Debug Mode

Enable debug logging by setting the log level:

```typescript
// In your main.ts or app configuration
import { Logger } from '@nestjs/common';

Logger.overrideLogger(['debug']);
```

## Examples

See the following files for complete examples:
- `redis.service.ts` - Complete Redis service implementation
- `redis-health.service.ts` - Health check implementation
- `redis.config.ts` - Configuration utilities
