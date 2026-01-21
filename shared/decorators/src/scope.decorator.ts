import { SetMetadata } from '@nestjs/common';

export const SCOPES_KEY = 'scopes';
export const Scopes = (scopes: string[]) => SetMetadata(SCOPES_KEY, scopes);

const enum ScopePermission {
  GUIDE_READ = 'guide:read',
  GUIDE_CREATE = 'guide:create',
  GUIDE_UPDATE = 'guide:update',
  GUIDE_DELETE = 'guide:delete',
  GUIDE_ALL = 'guide:*',

  TRAVELLER_READ = 'traveller:read',
  TRAVELLER_CREATE = 'traveller:create',
  TRAVELLER_UPDATE = 'traveller:update',
  TRAVELLER_DELETE = 'traveller:delete',
  TRAVELLER_ALL = 'traveller:*',

  TOUR_READ = 'tour:read',
  TOUR_CREATE = 'tour:create',
  TOUR_UPDATE = 'tour:update',
  TOUR_DELETE = 'tour:delete',
  TOUR_ALL = 'tour:*',

  RESERVATION_READ = 'reservation:read',
  RESERVATION_CREATE = 'reservation:create',
  RESERVATION_UPDATE = 'reservation:update',
  RESERVATION_DELETE = 'reservation:delete',
  RESERVATION_ALL = 'reservation:*',

  CATEGORY_READ = 'category:read',
  SUBCATEGORY_READ = 'subcategory:read',

}

export { ScopePermission };