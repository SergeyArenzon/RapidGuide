import { Injectable, Logger } from '@nestjs/common';
import { Providers } from './enums';
import { JwtService } from '@nestjs/jwt';
import { AuthDto, ProviderUserDto } from './dtos';
import { randomUUID } from 'crypto';

@Injectable()
export class RefreshTokenService {
  constructor() {}

  generateRefreshToken(user_id: string): string {
    const refreshToken =  randomUUID();
    const expiresAt = Date.now() + process.env.JWT_REFRESH_EXPIRES_IN || (7 * 24 * 60 * 60 * 1000); // 7 days

    return refreshToken;
  }

//   verifyRefreshToken(token: string): boolean {
//     const refreshToken = this.refreshTokens.get(token);
//     if (!refreshToken) {
//       return false;
//     }
//     return refreshToken.expiresAt > Date.now();
//   }

  
}