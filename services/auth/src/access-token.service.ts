import { Injectable, Logger } from '@nestjs/common';
import { Providers } from './enums';
import { JwtService } from '@nestjs/jwt';
import { AuthDto, ProviderUserDto } from './dtos';
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class AccessTokenService {
  private readonly logger = new Logger(AccessTokenService.name);

  constructor(private jwtService: JwtService) {}

  generateAccessToken(payload: Record<string, string>): string {
    this.logger.log('Sign JWT access token');
    return this.jwtService.sign(payload);
  }

  generateRefreshToken(): string {
    this.logger.log('Generating UUID refresh token');
    return uuidv4();
  }

  verifyRefreshToken(token: string): boolean {
    // For UUID refresh tokens, we just validate the format
    // In a real implementation, you'd check against a database
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(token);
  }

  async authenticateProvider(auth: AuthDto): Promise<ProviderUserDto> {
    {
      let user = {} as ProviderUserDto;
      switch (auth.provider) {
        case Providers.GOOGLE:
          const googleResponse = await fetch(
            `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${auth.jwt}`,
          );
          const googleResponseJson = await googleResponse.json();
          user = {
            email: googleResponseJson.email,
            first_name: googleResponseJson.given_name,
            last_name: googleResponseJson.family_name,
            image_url: googleResponseJson.picture,
          };
          break;
        default:
          break;
      }
      return user;
    }
  }
}
