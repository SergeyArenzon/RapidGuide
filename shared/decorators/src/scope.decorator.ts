import { SetMetadata } from '@nestjs/common';

export const SCOPES_KEY = 'scopes';
export const Scopes = (scopes: string | string[]) => SetMetadata(SCOPES_KEY, scopes);

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
  CATEGORY_CREATE = 'category:create',
  CATEGORY_UPDATE = 'category:update',
  CATEGORY_DELETE = 'category:delete',

  SUBCATEGORY_READ = 'subcategory:read',
  SUBCATEGORY_CREATE = 'subcategory:create',
  SUBCATEGORY_UPDATE = 'subcategory:update',
  SUBCATEGORY_DELETE = 'subcategory:delete',

  LANGUAGE_READ = 'language:read',
  LANGUAGE_CREATE = 'language:create',
  LANGUAGE_UPDATE = 'language:update',
  LANGUAGE_DELETE = 'language:delete',

  COUNTRY_READ = 'country:read',
  COUNTRY_CREATE = 'country:create',
  COUNTRY_UPDATE = 'country:update',
  COUNTRY_DELETE = 'country:delete',
  
  CITY_READ = 'city:read',
  CITY_CREATE = 'city:create',
  CITY_UPDATE = 'city:update',
  CITY_DELETE = 'city:delete',
}

export { ScopePermission };