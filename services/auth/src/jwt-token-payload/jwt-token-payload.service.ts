import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import type { GetProfilesMeResponseDto } from '@rapid-guide-io/contracts';
import { getProfilesMeResponseSchema } from '@rapid-guide-io/contracts';
import { firstValueFrom } from 'rxjs';
import { Session, User } from 'better-auth/types';
import { ScopeService } from '../scope/scope.service';

/**
 * Service responsible for fetching user profiles and generating
 * scopes and roles for JWT tokens.
 *
 * Follows NestJS best practices:
 * - Injectable service with dependency injection
 * - Proper error handling with logging
 * - Separation of concerns (pure utility functions for scope/role generation)
 */
@Injectable()
export class JwtTokenPayloadService {
  private readonly logger = new Logger(JwtTokenPayloadService.name);
  private readonly userServiceUrl: string;
  private readonly internalServiceToken: string;
  private readonly jwtExpirationTime: number;

  constructor(
    private readonly httpService: HttpService,
    private readonly scopeService: ScopeService,
  ) {
    // Consider using ConfigService for these values in the future
    this.userServiceUrl = 'http://user:3000';
    this.internalServiceToken = process.env.INTERNAL_SERVICE_TOKEN;
    this.jwtExpirationTime = 15 * 60;
  }

  /**
   * Fetches user profiles from the profile service.
   * Validates the response using Zod schema.
   *
   * @param userId - The user ID to fetch profiles for
   * @returns Promise resolving to validated profile data
   * @throws Error if the profile fetch fails
   */
  async create(session: Session, user: User) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<GetProfilesMeResponseDto>(
          `${this.userServiceUrl}/profile/${user.id}`,
          {
            params: { userId: user.id },
            headers: {
              'X-Service-Token': this.internalServiceToken,
            },
          },
        ),
      );

      const getProfileResponse = getProfilesMeResponseSchema.parse(data);

      let roles: string[] = [];
      let scopes: string[] = [];

      // create roles and scopes
      roles = this.getRoles(getProfileResponse);
      scopes = this.scopeService.getScopes(getProfileResponse);

      // Extract guide_id and traveller_id if they exist
      const guide_id = getProfileResponse.guide?.id;
      const traveller_id = getProfileResponse.traveller?.id;

      return this.payload(session, user, roles, scopes, guide_id, traveller_id);
    } catch (error) {
      this.logger.error(error);
      // Handle HTTP errors (from axios/HttpService)
      throw new Error(error);
    }
  }

  payload(
    session: Session,
    user: User,
    roles: string[],
    scopes: string[],
    guide_id?: string,
    traveller_id?: string,
  ) {
    const now = Math.floor(Date.now() / 1000); // Current time in seconds (Unix timestamp)
    // Convert Date objects to Unix timestamps (seconds)
    const iat =
      session.createdAt instanceof Date
        ? Math.floor(session.createdAt.getTime() / 1000)
        : session.createdAt;

    const payload: Record<string, any> = {
      // iss is set by better-auth JWT plugin configuration
      iss: 'auth-svc',
      aud: ['user-svc', 'tour-svc', 'reservation-svc'],
      id: user.id,
      sub: user.id,
      email: user.email,
      roles: roles,
      scopes: scopes, // Array of strings like ['guide:read', 'tour:create', ...]
      exp: now + this.jwtExpirationTime, // JWT expires in 15 minutes
      iat: iat, // Issued at time (Unix timestamp in seconds)
      nbf: iat, // Not before time (same as issued at)
      jti: session.token,
      ...(guide_id && { guide_id }),
      ...(traveller_id && { traveller_id }),
    };

    return payload;
  }

  getRoles(userData: GetProfilesMeResponseDto): string[] {
    const roles: string[] = [];

    if (userData.guide) {
      roles.push('guide');
    }
    if (userData.traveller) {
      roles.push('traveller');
    }

    return roles;
  }
}
