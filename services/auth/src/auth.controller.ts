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
import { AuthService } from './auth.service';
import { Response } from 'express';
import { AuthDto } from './dtos';

@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private authService: AuthService) {}

  // ENDPOINTS
  @HttpCode(200)
  @Get('/health')
  health() {}

  @Get()
  findUser() {
    return { first_name: 'John', last_name: 'Doe' };
  }

  @Post()
  @UsePipes(ValidationPipe)
  async signIn(
    @Res({ passthrough: true }) response: Response,
    @Body() body: AuthDto,
  ): Promise<any> {
    const user = await this.authService.authenticateProvider(body);
    this.logger.debug(`Authenticated user: ${JSON.stringify(user)}`);

    const res = await fetch('http://user:3000/user', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const authUser = await res.json();
    if (authUser?.statusCode === 400) {
      this.logger.warn(
        'Authentication failed: No user returned from user service',
      );
      throw new UnauthorizedException();
    }

    const token = this.authService.generateToken(authUser);

    this.logger.log('Setting accessToken cookie in response', authUser);

    response.cookie('accessToken', token, {
      httpOnly: true,
      maxAge: Number(process.env.JWT_MAX_AGE),
      secure: true,
    });
    return authUser;
  }
}
