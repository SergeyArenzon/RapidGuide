import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AccessTokenService } from './access-token/access-token.service';
import { RefreshTokenService } from './refresh-token/refresh-token.service';
import { AuthDto, UserDto } from '@rapid-guide-io/dto';
import { Request, Response } from 'express';



@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor() {}

  
}
