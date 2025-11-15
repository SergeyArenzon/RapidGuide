import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import type { GetProfilesResponseDto } from '@rapid-guide-io/contracts';
import { getProfilesResponseSchema } from '@rapid-guide-io/contracts';
import { firstValueFrom } from 'rxjs';

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

  constructor(private readonly httpService: HttpService) {
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
  async fetchProfiles(userId: string): Promise<GetProfilesResponseDto> {
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
      return validatedData;
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

  /**
   * Generates scopes from user profiles.
   * Optimized scope generation using wildcards to reduce JWT size.
   *
   * Example:
   * - 'guide:*' instead of ['guide:read', 'guide:create', 'guide:update', 'guide:delete']
   * - 'tour:*' instead of ['tour:read', 'tour:create', 'tour:update', 'tour:delete']
   *
   * This reduces JWT size significantly in large applications.
   *
   * @param profiles - User profile data
   * @returns Array of scope strings
   */
  getScopes(profiles: GetProfilesResponseDto): string[] {
    return getScopesFromProfiles(profiles);
  }

  /**
   * Generates roles from user profiles.
   *
   * @param profiles - User profile data
   * @returns Array of role strings
   */
  getRoles(profiles: GetProfilesResponseDto): string[] {
    return getRolesFromProfiles(profiles);
  }
}

/**
 * Pure utility function for scope generation.
 * Can be used independently of the service for testing or other use cases.
 *
 * Optimized scope generation using wildcards to reduce JWT size.
 * Instead of listing every action, use wildcards for full resource access.
 */
export function getScopesFromProfiles(
  profiles: GetProfilesResponseDto,
): string[] {
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

  // Common read-only scopes for all users
  // Group read-only scopes - could use 'catalog:read' if all catalog resources are read-only
  scopes.push(
    'category:read',
    'subcategory:read',
    'language:read',
    'country:read',
    'city:read',
  );

  // Remove duplicates and return
  return [...new Set(scopes)];
}

/**
 * Pure utility function for role generation.
 * Can be used independently of the service for testing or other use cases.
 */
export function getRolesFromProfiles(
  profiles: GetProfilesResponseDto,
): string[] {
  const roles: string[] = [];

  if (profiles.guide) {
    roles.push('guide');
  }

  return roles;
}

