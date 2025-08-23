import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { RedisService } from '@rapid-guide-io/redis';
import { UserDto } from '@rapid-guide-io/dto';

@Injectable()
export class RefreshTokenService {
  private readonly logger = new Logger(RefreshTokenService.name);
  private readonly REFRESH_TOKEN_PREFIX = 'refresh_token:';
  private readonly REFRESH_TOKEN_TTL = parseInt(process.env.JWT_REFRESH_EXPIRES_IN_MS); // Parse from env or default to 7 days

  constructor(private readonly redisService: RedisService) {}

  generateRefreshToken(): string {
    return randomUUID();
  }

  async storeRefreshToken(refreshToken: string, userData: UserDto): Promise<void> {
    const key = `${this.REFRESH_TOKEN_PREFIX}${refreshToken}`;
    const userDataString = JSON.stringify(userData);
    
    try {
      await this.redisService.set(key, userDataString, this.REFRESH_TOKEN_TTL);
      this.logger.debug(`Stored refresh token in Redis: ${key}`);
    } catch (error) {
      this.logger.error(`Failed to store refresh token in Redis: ${error.message}`);
      throw error;
    }
  }

  async validateRefreshToken(refreshToken: string): Promise<any | null> {
    const key = `${this.REFRESH_TOKEN_PREFIX}${refreshToken}`;
    
    try {
      const userDataString = await this.redisService.get(key);
      
      if (!userDataString) {
        this.logger.debug(`Refresh token not found in Redis: ${key}`);
        return null;
      }

      // Parse user data
      const userData = JSON.parse(userDataString);
      this.logger.debug(`Validated refresh token for user: ${userData.id || 'unknown'}`);
      
      return userData;
    } catch (error) {
      this.logger.error(`Failed to validate refresh token: ${error.message}`);
      return null;
    }
  }

  async revokeRefreshToken(refreshToken: string): Promise<boolean> {
    const key = `${this.REFRESH_TOKEN_PREFIX}${refreshToken}`;
    
    try {
      const result = await this.redisService.del(key);
      const success = result > 0;
      
      if (success) {
        this.logger.debug(`Revoked refresh token: ${key}`);
      } else {
        this.logger.debug(`Refresh token not found for revocation: ${key}`);
      }
      
      return success;
    } catch (error) {
      this.logger.error(`Failed to revoke refresh token: ${error.message}`);
      return false;
    }
  }

  async revokeAllUserTokens(userId: string): Promise<number> {
    try {
      // This is a simplified approach - in production you might want to maintain
      // a separate index of user refresh tokens for more efficient revocation
      const client = this.redisService.getClient();
      const pattern = `${this.REFRESH_TOKEN_PREFIX}*`;
      
      let revokedCount = 0;
      let cursor = '0';
      
      do {
        const [newCursor, keys] = await client.scan(cursor, 'MATCH', pattern, 'COUNT', '100');
        cursor = newCursor;
        
        for (const key of keys) {
          const userDataString = await this.redisService.get(key);
          if (userDataString) {
            try {
              const userData = JSON.parse(userDataString);
              if (userData.id === userId) {
                await this.redisService.del(key);
                revokedCount++;
              }
            } catch (error) {
              this.logger.warn(`Failed to parse user data for key ${key}: ${error.message}`);
            }
          }
        }
      } while (cursor !== '0');
      
      this.logger.debug(`Revoked ${revokedCount} refresh tokens for user: ${userId}`);
      return revokedCount;
    } catch (error) {
      this.logger.error(`Failed to revoke all user tokens: ${error.message}`);
      return 0;
    }
  }
}