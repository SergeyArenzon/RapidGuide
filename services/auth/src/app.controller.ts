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
import { Role, ScopePermission } from '@rapid-guide-io/decorators';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';


@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  private readonly jwt_refresh_expires_in_ms = Number(
    process.env.JWT_REFRESH_EXPIRES_IN_MS,
  );

  constructor(
    private accessTokenService: AccessTokenService,
    private refreshTokenService: RefreshTokenService,
  ) {}

  
  @AllowAnonymous()
  @HttpCode(200)
  @Get('/health')
  health() {}

  @Post()
  @UsePipes(ValidationPipe)
  async signIn(
    @Body() body: AuthDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    const providerUser =
      await this.accessTokenService.authenticateProvider(body);
    this.logger.debug(
      `Authenticated provider: ${JSON.stringify(providerUser)}`,
    );

    const internalAccessToken = this.accessTokenService.create(
      'user',
      'user',
      [Role.ADMIN],
      [ScopePermission.USER_READ, ScopePermission.USER_CREATE],
    );

    const res = await fetch('http://user:3000/user', {
      method: 'POST',
      body: JSON.stringify(providerUser),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${internalAccessToken}`,
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

    const accessToken = await this.accessTokenService.createClientAccessToken(
      user.id,
    );
    
    const refreshToken = this.refreshTokenService.generateRefreshToken();

    // Store refresh token with user data in Redis
    await this.refreshTokenService.storeRefreshToken(refreshToken, user);

    // Set refresh token as httpOnly cookie
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: this.jwt_refresh_expires_in_ms,
      secure: true,
      sameSite: 'lax',
    });

    // Return access token in response body for Authorization header usage
    return {
      user,
      accessToken,
    };
  }

  @Post('/refresh')
  async refresh(
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
    @Body() body,
  ): Promise<any> {
    // Validate refresh token and get user data from Redis
    const refreshToken = request.cookies?.refreshToken;
    console.log({ refreshToken });

    if (!refreshToken) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const userData = await this.refreshTokenService.validateRefreshToken(refreshToken);
    if (!userData) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const internalAccessToken = this.accessTokenService.create(
      'user',
      'user',
      [Role.ADMIN],
      [ScopePermission.USER_READ],
    );

    const userResponse = await fetch(
      `http://user:3000/user/${userData.userId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${internalAccessToken}`,
        },
      },
    );

    if (!userResponse.ok) {
      this.logger.warn(
        `User service returned ${userResponse.status} for user ${userData.userId}`,
      );
      throw new UnauthorizedException('Unauthorized');
    }

    const user: UserDto = await userResponse.json();

    // Generate new access token
    const newAccessToken =
      await this.accessTokenService.createClientAccessToken(user.id);
    const newRefreshToken = this.refreshTokenService.generateRefreshToken();

    await this.refreshTokenService.storeRefreshToken(newRefreshToken, user);
    await this.refreshTokenService.revokeRefreshToken(refreshToken);
    console.log({newAccessToken});
    
    // Set new refresh token as httpOnly cookie with secure attributes
    response.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      maxAge: this.jwt_refresh_expires_in_ms,
      secure: false, // TODO: Change to true on production
      sameSite: 'lax',
    });

    return {
      message: 'Token refreshed successfully',
      accessToken: newAccessToken,
      user,
    };
  }

  @Post('/logout')
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    this.logger.log('Logging out user');

    try {
      // Get refresh token from cookiescreat
      const refreshToken = request.cookies?.refreshToken;
      // Revoke refresh token if it exists in cookies
      if (refreshToken) {
        await this.refreshTokenService.revokeRefreshToken(refreshToken);
        this.logger.log('Revoked refresh token from Redis');
      }

      // Clear refresh token cookie
      response.clearCookie('refreshToken');

      this.logger.log('Successfully logged out user');
      return { message: 'Logged out successfully' };
    } catch (error) {
      this.logger.error('Error during logout:', error);
      // Even if there's an error, still clear the cookie
      response.clearCookie('refreshToken');
      return { message: 'Logged out successfully' };
    }
  }
}
