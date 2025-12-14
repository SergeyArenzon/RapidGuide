import { Injectable } from '@nestjs/common';
import { GetProfilesMeResponseDto } from '@rapid-guide-io/contracts';

@Injectable()
export class ScopeService {
  // Base scopes available to all users
  static readonly DEFAULT_SCOPES = [
    'category:read',
    'subcategory:read',
    'language:read',
    'country:read',
    'city:read',
    'guide:write',
    'traveller:write',
  ];

  // Guide-specific scopes (inherits DEFAULT_SCOPES)
  static readonly GUIDE_SCOPE = 'tour:*';
  static readonly TRAVELLER_SCOPE = 'tour:*';

  getScopes(profile: GetProfilesMeResponseDto) {
    const scopes: string[] = [...ScopeService.DEFAULT_SCOPES];
    if (profile.traveller) {
      scopes.push(ScopeService.TRAVELLER_SCOPE);
      const travellerWriteIndex = scopes.indexOf('traveller:write');
      scopes.splice(travellerWriteIndex, 1);
    }
    if (profile.guide) {
      scopes.push(ScopeService.GUIDE_SCOPE);
      const guideWriteIndex = scopes.indexOf('guide:write');
      scopes.splice(guideWriteIndex, 1);
    }
    return scopes;
  }
}
