import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import type { GetProfilesResponseDto } from '@rapid-guide-io/contracts';
import { getProfilesResponseSchema } from '@rapid-guide-io/contracts';
import { firstValueFrom } from 'rxjs';
import { RoleService } from '../role/role.service';
import { ScopeService } from '../scope/scope.service';
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
export class PermissionService {
  private readonly logger = new Logger(PermissionService.name);
  private readonly profileServiceUrl: string;
  private readonly serviceToken: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly roleService: RoleService,
    private readonly scopeService: ScopeService,
    
  ) {
    // Consider using ConfigService for these values in the future
    this.profileServiceUrl = process.env.PROFILE_SERVICE_URL;
    this.serviceToken = process.env.SERVICE_TO_SERVICE_TOKEN;
  }

  /**
   * Fetches user profiles from the profile service.
   * Validates the response using Zod schema.
   *
   * @param userId - The user ID to fetch profiles for
   * @returns Promise resolving to validated profile data
   * @throws Error if the profile fetch fails
   */
  async getPermissions(userId: string) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<GetProfilesResponseDto>(
          `${this.profileServiceUrl}/${userId}`,
          {
            params: { userId },
            headers: {
              'X-Service-Token': this.serviceToken,
            },
          },
        ),
      );

      const validatedData = getProfilesResponseSchema.parse(data);
      let roles: string[] = [];
      let scopes: string[] = [];
      roles = this.roleService.getRoles(validatedData);
      scopes = this.scopeService.getScopes(validatedData);
      return { roles, scopes };

    } catch (error) {
      // Handle HTTP errors (from axios/HttpService)
      if (
        error &&
        typeof error === 'object' &&
        'response' in error &&
        'status' in error
      ) {
        const httpError = error as {
          response?: { status?: number };
          message?: string;
        };
        this.logger.error(
          `Failed to fetch profiles for user ${userId}: ${httpError.message || 'Unknown error'}`,
          error instanceof Error ? error.stack : undefined,
        );
        throw new Error(
          `Profile service error: ${httpError.response?.status || 'Unknown'} - ${httpError.message || 'Request failed'}`,
        );
      }

      // Handle Zod validation errors
      if (error && typeof error === 'object' && 'issues' in error) {
        this.logger.error(
          `Profile data validation failed for user ${userId}`,
          error,
        );
        throw new Error('Invalid profile data format received');
      }

      // Handle other errors
      this.logger.error(
        `Unexpected error fetching profiles for user ${userId}`,
        error,
      );
      throw error;
    }
  }

  createJwtTokenPayload(session: Session, user: User, roles: string[], scopes: string[]){
    const payload = {
      issuer: 'auth-svc',
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

}


