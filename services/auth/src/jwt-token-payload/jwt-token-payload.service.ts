import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import type { GetProfilesResponseDto } from '@rapid-guide-io/contracts';
import { getProfilesResponseSchema } from '@rapid-guide-io/contracts';
import { firstValueFrom } from 'rxjs';
import { Session, User } from 'better-auth/types';

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
  private readonly profileServiceUrl: string;
  private readonly internalServiceToken: string;

  constructor(private readonly httpService: HttpService) {
    // Consider using ConfigService for these values in the future
    this.profileServiceUrl = 'http://profile:3000';
    this.internalServiceToken = process.env.INTERNAL_SERVICE_TOKEN;
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
        this.httpService.get<GetProfilesResponseDto>(
          `${this.profileServiceUrl}/profile/${user.id}`,
          {
            params: { userId: user.id },
            headers: {
              'X-Service-Token': this.internalServiceToken,
            },
          },
        ),
      );

      const validatedData = getProfilesResponseSchema.parse(data);

      let roles: string[] = [];
      let scopes: string[] = [];

      // create roles and scopes
      roles = this.getRoles(validatedData);
      scopes = this.getScopes(validatedData);

      return this.payload(session, user, roles, scopes);
    } catch (error) {
      this.logger.error(error);
      // Handle HTTP errors (from axios/HttpService)
      throw new Error(error);
    }
  }

  payload(session: Session, user: User, roles: string[], scopes: string[]) {
    const payload = {
      // iss is set by better-auth JWT plugin configuration
      iss: 'auth-svc',
      aud: ['profile-svc', 'tour-svc'],
      id: user.id,
      sub: user.id,
      email: user.email,
      roles: roles,
      scopes: scopes, // Array of strings like ['guide:read', 'tour:create', ...]
      exp: session.expiresAt,
      iat: session.createdAt,
      nbf: session.createdAt,
      jti: session.token,
    };
    return payload;
  }

  getRoles(profiles: GetProfilesResponseDto): string[] {
    const roles: string[] = [];

    if (profiles.guide) {
      roles.push('guide');
    }

    return roles;
  }

  /**
   * Pure utility function for scope generation.
   * Can be used independently of the service for testing or other use cases.
   *
   * Optimized scope generation using wildcards to reduce JWT size.
   * Instead of listing every action, use wildcards for full resource access.
   */
  getScopes(profiles: GetProfilesResponseDto): string[] {
    const scopes: string[] = [];
    // Guide profile scopes - use wildcards for full access
    if (profiles.guide) {
      scopes.push(
        'guide:*', // Full guide access (read, create, update, delete)
        'tour:*', // Full tour access
      );
    } 

    // Traveller profile scopes (if you have a traveller profile)
    // if (profiles.traveller) {
    //   scopes.push(
    //     'traveller:*', // Full traveller access
    //     'tour:read', // Travellers can only read tours, not create
    //   );
    // }

    // no guide or traveller profile scopes, so we need to add the default scopes
    else {
      scopes.push(
        'category:read',
        'subcategory:read',
        'language:read',
        'country:read',
        'city:read',
      );
    }

    // Remove duplicates and return
    return [...new Set(scopes)];
  }
}
