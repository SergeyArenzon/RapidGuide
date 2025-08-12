export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
  retryDelayOnFailover?: number;
  enableReadyCheck?: boolean;
  maxRetriesPerRequest?: number | null;
  lazyConnect?: boolean;
  keyPrefix?: string;
  family?: number;
  connectTimeout?: number;
  commandTimeout?: number;
  keepAlive?: number;
  noDelay?: boolean;
  connectionName?: string;
}

export const createRedisConfig = (): RedisConfig => ({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0', 10),
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
  lazyConnect: true,
  keyPrefix: process.env.REDIS_KEY_PREFIX || '',
  family: 4, // IPv4
  connectTimeout: 10000, // 10 seconds
  commandTimeout: 5000, // 5 seconds
  keepAlive: 30000, // 30 seconds
  noDelay: true,
  connectionName: process.env.REDIS_CONNECTION_NAME || 'nestjs-redis',
});

export const createRedisUrl = (config: RedisConfig): string => {
  const { host, port, password, db } = config;
  const auth = password ? `:${password}@` : '';
  return `redis://${auth}${host}:${port}/${db}`;
};
