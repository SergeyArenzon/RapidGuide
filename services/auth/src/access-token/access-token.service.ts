import { Injectable, Logger } from '@nestjs/common';
import { AuthDto, ProviderUserDto, authSchema } from '@rapid-guide-io/dto';
import { JwtService } from '@nestjs/jwt';
import { Role, ScopePermission } from '@rapid-guide-io/decorators';

class JwtPayload {
  sub: string;
  iss: string;
  aud: string;
  roles: string[];
  scopes: string[];
  iat: number;

  constructor(sub: string, aud: string, roles: string[], scopes: string[]) {
    this.iss = 'auth';
    this.sub = sub;
    this.aud = aud;
    this.roles = roles;
    this.scopes = scopes;
    this.iat = Date.now();
  }

  toJSON() {
    return {
      sub: this.sub,
      iss: this.iss,
      aud: this.aud,
      roles: this.roles,
      scopes: this.scopes,
      iat: this.iat,
    };
  }
}

@Injectable()
export class AccessTokenService {
  private readonly logger = new Logger(AccessTokenService.name);
  constructor(private jwtService: JwtService) {}

  async createClientAccessToken(userId: string): Promise<string> {
    return this.create(
      userId,
      'client',
      [Role.CLIENT],
      [
        ScopePermission.USER_READ,
        ScopePermission.USER_CREATE,
        ScopePermission.USER_UPDATE,
        ScopePermission.TOUR_READ,
        ScopePermission.TOUR_CREATE,
        ScopePermission.TOUR_UPDATE,
        ScopePermission.TOUR_DELETE,
        ScopePermission.GUIDE_READ,
        ScopePermission.GUIDE_CREATE,
        ScopePermission.GUIDE_UPDATE,
        ScopePermission.GUIDE_DELETE,
        ScopePermission.TRAVELLER_READ,
        ScopePermission.TRAVELLER_CREATE,
        ScopePermission.TRAVELLER_UPDATE,
        ScopePermission.TRAVELLER_DELETE,
      ],
    );
  }

  create(sub: string, aud: string, roles: string[], scopes: string[]): string {
    this.logger.log('Sign JWT access token');
    const payload = new JwtPayload(sub, aud, roles, scopes);
    return this.jwtService.sign(payload.toJSON());
  }

  async authenticateProvider(auth: AuthDto): Promise<ProviderUserDto> {
    {
      let user = {} as ProviderUserDto;
      switch (auth.provider) {
        case authSchema.shape.provider.enum.google:
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
