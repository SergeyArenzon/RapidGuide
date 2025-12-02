import { SetMetadata } from '@nestjs/common';

export const SCOPES_KEY = 'scopes';
export const Scopes = (scopes: string | string[]) => SetMetadata(SCOPES_KEY, scopes);

const enum ScopePermission {
  GUIDE_READ = 'guide:read',
  GUIDE_WRITE = 'guide:write',
  GUIDE_UPDATE = 'guide:update',
  GUIDE_DELETE = 'guide:delete',

  TRAVELLER_READ = 'traveller:read',
  TRAVELLER_WRITE = 'traveller:write',
  TRAVELLER_UPDATE = 'traveller:update',
  TRAVELLER_DELETE = 'traveller:delete',

  TOUR_READ = 'tour:read',
  TOUR_WRITE = 'tour:write',
  TOUR_UPDATE = 'tour:update',
  TOUR_DELETE = 'tour:delete',

}

export { ScopePermission };