import { Injectable, Logger } from '@nestjs/common';
import { AuthDto, ProviderUserDto, UserDto, authSchema } from '@rapid-guide-io/dto';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';



class JwtPayload {
  sub: string;
  iss: string;
  aud: string;
  iat: number;
  exp: number;

  constructor(sub: string, type: "internal" | "external") {
    this.sub = sub;
    this.iss = "auth-service";
    this.aud = "user-service";
    this.iat = Date.now();
    this.exp = Date.now() + Number(process.env.JWT_ACCESS_EXPIRES_IN_MS);
  } 

  toJSON() {
    return {
      sub: this.sub,
      iss: this.iss,
      aud: this.aud,
      iat: this.iat,
      exp: this.exp
    };
  }
}


@Injectable()
export class AccessTokenService {
  private readonly logger = new Logger(AccessTokenService.name);
  constructor(private jwtService: JwtService) {}


  generateAccessToken(sub: string, type: "internal" | "external"): string {
    this.logger.log('Sign JWT access token');
    const payload = new JwtPayload(sub, type);
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
