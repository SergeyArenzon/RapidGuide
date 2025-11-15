import { HttpService } from '@nestjs/axios';
import {
  GetProfilesResponseDto,
  getProfilesResponseSchema,
} from '@rapid-guide-io/contracts';
import { firstValueFrom } from 'rxjs';

export const fetchProfiles = async (
  userId: string,
  httpService: HttpService,
): Promise<GetProfilesResponseDto> => {
  const { data } = await firstValueFrom(
    httpService.get<{ scopes: string[] }>(`http://profile:3000/${userId}`, {
      params: { userId },
      headers: {
        'X-Service-Token': process.env.SERVICE_TO_SERVICE_TOKEN,
      },
    }),
  );
  const validatedData = getProfilesResponseSchema.parse(data);
  return validatedData;
};

/**
 * Optimized scope generation using wildcards to reduce JWT size.
 * Instead of listing every action, use wildcards for full resource access.
 *
 * Example:
 * - 'guide:*' instead of ['guide:read', 'guide:create', 'guide:update', 'guide:delete']
 * - 'tour:*' instead of ['tour:read', 'tour:create', 'tour:update', 'tour:delete']
 *
 * This reduces JWT size significantly in large applications.
 */
export const getScopes = (profiles: GetProfilesResponseDto): string[] => {
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
};

export const getRoles = (profiles: GetProfilesResponseDto): string[] => {
  const roles: string[] = [];

  if (profiles.guide) {
    roles.push('guide');
  }

  return roles;
};