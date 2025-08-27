import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  Logger,
  UnauthorizedException,
  Res,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AccessTokenService } from './access-token/access-token.service';
import { Response, Request } from 'express';
import { AuthDto, UserDto } from '@rapid-guide-io/dto';
import { RefreshTokenService } from './refresh-token/refresh-token.service';
import { RefreshTokenDto } from './types/auth';


@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private accessTokenService: AccessTokenService, 
    private refreshTokenService: RefreshTokenService
  ) {}

  // ENDPOINTS
  @HttpCode(200)
  @Get('/health')
  health() {}

  @Post()
  @UsePipes(ValidationPipe)
  async signIn(@Body() body: AuthDto): Promise<any> {
    const providerUser = await this.accessTokenService.authenticateProvider(body);
    this.logger.debug(`Authenticated provider: ${JSON.stringify(providerUser)}`);

    const internalAccessToken = this.accessTokenService.generateAccessToken("internal");

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
  async refresh(
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
    @Body() body,
  ): Promise<any> {
    try {
      // Validate refresh token and get user data from Redis
      const refreshToken = request.cookies?.refreshToken;

      if (!refreshToken) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      const userData = await this.refreshTokenService.validateRefreshToken(refreshToken);
      if (!userData) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      const userResponse = await fetch(`http://user:3000/user/${userData.userId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `accessToken=${request.cookies?.accessToken}`
        }
      });

      if (!userResponse.ok) {
        this.logger.warn(`User service returned ${userResponse.status} for user ${userData.userId}`);
        throw new UnauthorizedException('User not found');
      }

      const user: UserDto = await userResponse.json();
      
      // Generate new access token
      const newAccessToken = this.accessTokenService.generateAccessToken(user);
      const newRefreshToken = this.refreshTokenService.generateRefreshToken();

      await this.refreshTokenService.storeRefreshToken(newRefreshToken, user);
      await this.refreshTokenService.revokeRefreshToken(refreshToken);
      
      this.logger.log('Refreshing access token for user', userData);

      // Set new access token cookie
      response.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        maxAge: parseInt(process.env.JWT_ACCESS_EXPIRES_IN_MS),
        secure: true,
      });

      response.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        maxAge: parseInt(process.env.JWT_REFRESH_EXPIRES_IN_MS),
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
    @Req() request: Request, 
    @Res({ passthrough: true }) response: Response): Promise<any> {
    this.logger.log('Logging out user');

    try {
      // Get refresh token from cookies
      const refreshToken = request.cookies?.refreshToken;
      
      // Revoke refresh token if it exists in cookies
      if (refreshToken) {
        await this.refreshTokenService.revokeRefreshToken(refreshToken);
        this.logger.log('Revoked refresh token from Redis');
      }

      // Clear both cookies by setting them to expire immediately
      response.clearCookie('accessToken');
      response.clearCookie('refreshToken');

      this.logger.log('Successfully logged out user');
      return { message: 'Logged out successfully' };
    } catch (error) {
      this.logger.error('Error during logout:', error);
      // Even if there's an error, still clear the cookies
      response.clearCookie('accessToken');
      response.clearCookie('refreshToken');
      return { message: 'Logged out successfully' };
    }
  }
}
