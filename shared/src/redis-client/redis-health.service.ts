import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from './redis.service';

export interface HealthCheckResult {
  status: 'up' | 'down';
  details?: Record<string, any>;
  error?: string;
}

@Injectable()
export class RedisHealthIndicator {
  private readonly logger = new Logger(RedisHealthIndicator.name);

  constructor(private readonly redisService: RedisService) {}

  async isHealthy(key: string): Promise<HealthCheckResult> {
    try {
      const startTime = Date.now();
      const result = await this.redisService.ping();
      const responseTime = Date.now() - startTime;

      if (result === 'PONG') {
        return {
          status: 'up',
          details: { responseTime: `${responseTime}ms` }
        };
      }

      return {
        status: 'down',
        error: 'Unexpected response from Redis'
      };
    } catch (error) {
      this.logger.error('Redis health check failed:', error);
      return {
        status: 'down',
        error: error.message
      };
    }
  }

  async isHealthyWithDetails(key: string): Promise<HealthCheckResult> {
    try {
      const startTime = Date.now();
      const pingResult = await this.redisService.ping();
      const responseTime = Date.now() - startTime;

      if (pingResult !== 'PONG') {
        return {
          status: 'down',
          error: 'Unexpected response from Redis'
        };
      }

      // Get Redis info for additional health metrics
      const redisInstance = this.redisService.getRedisInstance();
      const info = await redisInstance.info('server');
      
      // Parse basic info
      const infoLines = info.split('\r\n');
      const redisVersion = infoLines.find(line => line.startsWith('redis_version:'))?.split(':')[1] || 'unknown';
      const uptime = infoLines.find(line => line.startsWith('uptime_in_seconds:'))?.split(':')[1] || 'unknown';
      const connectedClients = infoLines.find(line => line.startsWith('connected_clients:'))?.split(':')[1] || 'unknown';

      return {
        status: 'up',
        details: {
          responseTime: `${responseTime}ms`,
          redisVersion,
          uptime: `${uptime}s`,
          connectedClients,
          timestamp: new Date().toISOString(),
        }
      };
    } catch (error) {
      this.logger.error('Redis detailed health check failed:', error);
      return {
        status: 'down',
        error: error.message
      };
    }
  }
}
