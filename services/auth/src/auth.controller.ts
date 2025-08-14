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
import { AuthDto } from '@rapid-guide-io/dto';
import { RefreshTokenService } from './refresh-token/refresh-token.service';
import { RedisService } from '@rapid-guide-io/redis';

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
    const user = await this.accessTokenService.authenticateProvider(body);
    this.logger.debug(`Authenticated provider: ${JSON.stringify(user)}`);

    const res = await fetch('http://user:3000/user', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const authUser = await res.json();
    this.logger.debug(`Authenticated user: ${JSON.stringify(authUser)}`);
    if (authUser?.statusCode === 400) {
      this.logger.warn(
        'Authentication failed: No user returned from user service',
      );
      throw new UnauthorizedException();
    }

    const accessToken = this.accessTokenService.generateAccessToken(authUser);
    const refreshToken = this.accessTokenService.generateRefreshToken();

    // Store refresh token with user data
    // this.refreshTokenService.set(refreshToken, authUser);

    this.logger.log('Setting access and refresh token cookies in response', authUser);

    // Set access token cookie
    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: Number(process.env.JWT_ACCESS_MAX_AGE) || 15 * 60 * 1000, // 15 minutes
      secure: true,
    });

    // Set refresh token cookie
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: Number(process.env.JWT_REFRESH_MAX_AGE) || 7 * 24 * 60 * 60 * 1000, // 7 days
      secure: true,
    });

    return authUser;
  }

  // @Post('/refresh')
  // @UsePipes(ValidationPipe)
  // async refresh(
  //   @Res({ passthrough: true }) response: Response,
  //   @Body() body: RefreshTokenDto,
  // ): Promise<any> {
  //   try {
  //     // Validate refresh token format
  //     if (!this.accessTokenService.verifyRefreshToken(body.refreshToken)) {
  //       throw new UnauthorizedException('Invalid refresh token format');
  //     }

  //     // Check if refresh token exists and get user data
  //     const userData = this.refreshTokenService.validateRefreshToken(body.refreshToken);
  //     if (!userData) {
  //       throw new UnauthorizedException('Invalid or expired refresh token');
  //     }

  //     // Generate new access token
  //     const newAccessToken = this.accessTokenService.generateAccessToken(userData);
      
  //     this.logger.log('Refreshing access token for user', userData);

  //     // Set new access token cookie
  //     response.cookie('accessToken', newAccessToken, {
  //       httpOnly: true,
  //       maxAge: Number(process.env.JWT_ACCESS_MAX_AGE) || 15 * 60 * 1000, // 15 minutes
  //       secure: true,
  //     });

  //     return { message: 'Token refreshed successfully' };
  //   } catch (error) {
  //     this.logger.error('Failed to refresh token', error);
  //     throw new UnauthorizedException('Invalid refresh token');
  //   }
  // }



  @Post('/logout')
  async logout(
    @Res({ passthrough: true }) response: Response,
    @Body() body: { refreshToken?: string },
  ): Promise<any> {
    this.logger.log('Logging out user');

    // Revoke refresh token if provided
    if (body.refreshToken) {
      // this.refreshTokens.delete(body.refreshToken);
      this.logger.log('Revoked refresh token');
    }

    // Clear both cookies
    response.clearCookie('accessToken');
    response.clearCookie('refreshToken');

    return { message: 'Logged out successfully' };
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
