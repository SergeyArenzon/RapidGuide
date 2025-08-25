import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  Logger,
  UnauthorizedException,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AccessTokenService } from './access-token/access-token.service';
import { Response } from 'express';
import { AuthDto, UserDto } from '@rapid-guide-io/dto';
import { RefreshTokenService } from './refresh-token/refresh-token.service';
import { RedisService } from '@rapid-guide-io/redis';
import { RefreshTokenDto, LogoutDto, LogoutAllDto } from './types/auth';

@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private accessTokenService: AccessTokenService, 
    private refreshTokenService: RefreshTokenService,
    private redisService: RedisService) {}

  // ENDPOINTS
  @HttpCode(200)
  @Get('/health')
  health() {}

  @Post()
  @UsePipes(ValidationPipe)
  async signIn(
    @Res({ passthrough: true }) response: Response,
    @Body() body: AuthDto,
  ): Promise<any> {
    const providerUser = await this.accessTokenService.authenticateProvider(body);
    this.logger.debug(`Authenticated provider: ${JSON.stringify(providerUser)}`);

    const res = await fetch('http://user:3000/user', {
      method: 'POST',
      body: JSON.stringify(providerUser),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const user: UserDto = await res.json();
    this.logger.debug(`Authenticated user: ${JSON.stringify(user)}`);
    if (res.status === 400) {
      this.logger.warn(
        'Authentication failed: No user returned from user service',
      );
      throw new UnauthorizedException();
    }

    const accessToken = this.accessTokenService.generateAccessToken(user);
    const refreshToken = this.refreshTokenService.generateRefreshToken();

    // Store refresh token with user data in Redis
    await this.refreshTokenService.storeRefreshToken(refreshToken, user);

    this.logger.log('Setting access and refresh token cookies in response', user);

    return {
      user,
      cookies: [{
        name: 'accessToken',
        value: accessToken,
        httpOnly: true,
        maxAge: Number(process.env.JWT_ACCESS_EXPIRES_IN_MS),
        secure: true,
      }, {
        name: 'refreshToken',
        value: refreshToken,
        httpOnly: true,
        maxAge: Number(process.env.JWT_REFRESH_EXPIRES_IN_MS),
        secure: true,
      }]
    }
  }

  @Post('/refresh')
  @UsePipes(ValidationPipe)
  async refresh(
    @Res({ passthrough: true }) response: Response,
    @Body() body: RefreshTokenDto,
  ): Promise<any> {
    try {
      // Validate refresh token and get user data from Redis
      const userData = await this.refreshTokenService.validateRefreshToken(body.refreshToken);
      if (!userData) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      // Generate new access token
      const newAccessToken = this.accessTokenService.generateAccessToken(userData);
      
      this.logger.log('Refreshing access token for user', userData);

      // Set new access token cookie
      response.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        maxAge: parseInt(process.env.JWT_ACCESS_EXPIRES_IN_MS),
        secure: true,
      });

      return { message: 'Token refreshed successfully' };
    } catch (error) {
      this.logger.error('Failed to refresh token', error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  @Post('/logout')
  async logout(
    @Res({ passthrough: true }) response: Response,
    @Body() body: LogoutDto,
  ): Promise<any> {
    this.logger.log('Logging out user');

    // Revoke refresh token if provided
    if (body.refreshToken) {
      await this.refreshTokenService.revokeRefreshToken(body.refreshToken);
      this.logger.log('Revoked refresh token');
    }

    // Clear both cookies
    response.clearCookie('accessToken');
    response.clearCookie('refreshToken');

    return { message: 'Logged out successfully' };
  }

  @Post('/logout-all')
  async logoutAll(
    @Res({ passthrough: true }) response: Response,
    @Body() body: LogoutAllDto,
  ): Promise<any> {
    this.logger.log(`Logging out all sessions for user: ${body.userId}`);

    // Revoke all refresh tokens for the user
    const revokedCount = await this.refreshTokenService.revokeAllUserTokens(body.userId);
    this.logger.log(`Revoked ${revokedCount} refresh tokens for user: ${body.userId}`);

    // Clear cookies
    response.clearCookie('accessToken');
    response.clearCookie('refreshToken');

    return { 
      message: 'Logged out from all sessions successfully',
      revokedTokensCount: revokedCount
    };
  }


  @Get('/test')
  async testRedis() {
    try {
      const testKey = 'sergey:test';
      const testValue = new Date().toISOString();
      
      // Set data in Redis with 60 seconds TTL
      await this.redisService.set(testKey, testValue, 60);
      
      // Get the data back to verify
      const retrievedValue = await this.redisService.get(testKey);
      
      this.logger.log(`Test data set in Redis: ${testKey} = ${testValue}`);
      
      return {
        message: 'Redis test successful',
        data: {
          key: testKey,
          value: testValue,
          retrieved: retrievedValue,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      this.logger.error('Redis test failed', error);
      throw new Error(`Redis test failed: ${error.message}`);
    }
  }
}
