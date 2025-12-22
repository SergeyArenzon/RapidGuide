import { SetMetadata } from '@nestjs/common';

export const SCOPES_KEY = 'scopes';
export const Scopes = (scopes: string[]) => SetMetadata(SCOPES_KEY, scopes);

const enum ScopePermission {
  GUIDE_READ = 'guide:read',
  GUIDE_CREATE = 'guide:create',
  GUIDE_UPDATE = 'guide:update',
  GUIDE_DELETE = 'guide:delete',

  TRAVELLER_READ = 'traveller:read',
  TRAVELLER_CREATE = 'traveller:create',
  TRAVELLER_UPDATE = 'traveller:update',
  TRAVELLER_DELETE = 'traveller:delete',

  TOUR_READ = 'tour:read',
  TOUR_CREATE = 'tour:create',
  TOUR_UPDATE = 'tour:update',
  TOUR_DELETE = 'tour:delete',

  CATEGORY_READ = 'category:read',

  SUBCATEGORY_READ = 'subcategory:read',

}

export { ScopePermission };