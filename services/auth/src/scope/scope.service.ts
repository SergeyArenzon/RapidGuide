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
  ];

  // Guide-specific scopes (inherits DEFAULT_SCOPES)
  static readonly GUIDE_SCOPES = [...ScopeService.DEFAULT_SCOPES, 'tour:*'];

  getScopes(profile: GetProfilesMeResponseDto) {
    if (profile.guide) {
      return ScopeService.GUIDE_SCOPES;
    }
    return ScopeService.DEFAULT_SCOPES;
  }
}
