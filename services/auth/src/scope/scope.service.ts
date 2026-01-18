import { Injectable } from '@nestjs/common';
import { GetProfilesMeResponseDto } from '@rapid-guide-io/contracts';
import { ScopePermission } from '@rapid-guide-io/decorators';

@Injectable()
export class ScopeService {
  // Base scopes available to all users
  static readonly DEFAULT_SCOPES = [
    ScopePermission.CATEGORY_READ,
    ScopePermission.SUBCATEGORY_READ,
    ScopePermission.GUIDE_CREATE,
    ScopePermission.TRAVELLER_CREATE,
  ];

  // Guide-specific scopes (inherits DEFAULT_SCOPES)
  static readonly GUIDE_SCOPE = 'guide:*';
  static readonly TRAVELLER_SCOPE = 'tour:*';

  getScopes(profile: GetProfilesMeResponseDto) {
    const scopes: string[] = [...ScopeService.DEFAULT_SCOPES];
    if (profile.traveller) {
      scopes.push(
        ScopeService.TRAVELLER_SCOPE,
        ScopePermission.RESERVATION_CREATE,
        ScopePermission.RESERVATION_READ,
        ScopePermission.RESERVATION_UPDATE,
        ScopePermission.RESERVATION_DELETE,
      );
      const travellerWriteIndex = scopes.indexOf(
        ScopePermission.TRAVELLER_CREATE,
      );
      scopes.splice(travellerWriteIndex, 1);
    }
    if (profile.guide) {
      scopes.push(ScopeService.GUIDE_SCOPE);
      scopes.push(
        ScopePermission.RESERVATION_READ,
        ScopePermission.RESERVATION_UPDATE,
        ScopePermission.RESERVATION_DELETE,
      );
      const guideWriteIndex = scopes.indexOf(ScopePermission.GUIDE_CREATE);
      scopes.splice(guideWriteIndex, 1);
    }
    return scopes;
  }
}
