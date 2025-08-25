import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { RedisService } from '@rapid-guide-io/redis';
import { UserDto } from '@rapid-guide-io/dto';

interface RefreshTokenData {
  userId: string;
  deviceInfo?: string;
  ipAddress?: string;
}

@Injectable()
export class RefreshTokenService {
  private readonly logger = new Logger(RefreshTokenService.name);
  private readonly REFRESH_TOKEN_PREFIX = 'refresh_token:';
  private readonly REFRESH_TOKEN_TTL = Number(process.env.JWT_REFRESH_EXPIRES_IN_MS)

  constructor(private readonly redisService: RedisService) {}

  generateRefreshToken(): string {
    return randomUUID();
  }

  async storeRefreshToken(
    refreshToken: string, 
    userData: UserDto, 
    deviceInfo?: string, 
    ipAddress?: string
  ): Promise<void> {
    const key = `${this.REFRESH_TOKEN_PREFIX}${refreshToken}`;
    
    const tokenData: RefreshTokenData = {
      userId: userData.id,
      deviceInfo,
      ipAddress
    };
    
    try {
      // Store the refresh token with its data
      console.log({key, tokenData, ttl: this.REFRESH_TOKEN_TTL});
      
      await this.redisService.set(key, JSON.stringify(tokenData), this.REFRESH_TOKEN_TTL);
      
      this.logger.debug(`Stored refresh token in Redis: ${key} for user: ${userData.id}`);
    } catch (error) {
      this.logger.error(`Failed to store refresh token in Redis: ${error.message}`);
      throw error;
    }
  }

  async validateRefreshToken(refreshToken: string): Promise<RefreshTokenData | null> {
    const key = `${this.REFRESH_TOKEN_PREFIX}${refreshToken}`;
    
    try {
      const tokenDataString = await this.redisService.get(key);
      
      if (!tokenDataString) {
        this.logger.debug(`Refresh token not found in Redis: ${key}`);
        return null;
      }

      // Parse token data
      const tokenData: RefreshTokenData = JSON.parse(tokenDataString);
      
      this.logger.debug(`Validated refresh token for user: ${tokenData.userId}`);
      return tokenData;
    } catch (error) {
      this.logger.error(`Failed to validate refresh token: ${error.message}`);
      return null;
    }
  }

  /**
   * Get user data for a refresh token - this should be called separately
   * when you actually need the user information
   */
  async getUserIdFromToken(refreshToken: string): Promise<string | null> {
    const tokenData = await this.validateRefreshToken(refreshToken);
    return tokenData?.userId || null;
  }

  async revokeRefreshToken(refreshToken: string): Promise<boolean> {
    const key = `${this.REFRESH_TOKEN_PREFIX}${refreshToken}`;
    
    try {
      // Delete the refresh token
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

  async getTokenInfo(refreshToken: string): Promise<RefreshTokenData | null> {
    const key = `${this.REFRESH_TOKEN_PREFIX}${refreshToken}`;
    
    try {
      const tokenDataString = await this.redisService.get(key);
      if (!tokenDataString) {
        return null;
      }
      
      return JSON.parse(tokenDataString);
    } catch (error) {
      this.logger.error(`Failed to get token info: ${error.message}`);
      return null;
    }
  }
}