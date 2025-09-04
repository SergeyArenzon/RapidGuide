import { SetMetadata } from '@nestjs/common';

export const SCOPES_KEY = 'scopes';
export const Scopes = (scopes: string[]) => SetMetadata(SCOPES_KEY, scopes);


export const enum ScopePermission {
    // User permissions
    USER_READ = 'user:read',
    USER_CREATE = 'user:create',
    USER_UPDATE = 'user:update',
    USER_DELETE = 'user:delete',
    
    // Guide permissions
    GUIDE_READ = 'guide:read',
    GUIDE_CREATE = 'guide:create',
    GUIDE_UPDATE = 'guide:update',
    GUIDE_DELETE = 'guide:delete',
    
    // Traveller permissions
    TRAVELLER_READ = 'traveller:read',
    TRAVELLER_CREATE = 'traveller:create',
    TRAVELLER_UPDATE = 'traveller:update',
    TRAVELLER_DELETE = 'traveller:delete',
    
    // Tour permissions
    TOUR_READ = 'tour:read',
    TOUR_CREATE = 'tour:create',
    TOUR_UPDATE = 'tour:update',
    TOUR_DELETE = 'tour:delete',

    // Category permissions
    CATEGORY_READ = 'category:read',
    CATEGORY_CREATE = 'category:create',
    CATEGORY_UPDATE = 'category:update',
    CATEGORY_DELETE = 'category:delete',

    // SubCategory permissions
    SUBCATEGORY_READ = 'subcategory:read',
    SUBCATEGORY_CREATE = 'subcategory:create',
    SUBCATEGORY_UPDATE = 'subcategory:update',
    SUBCATEGORY_DELETE = 'subcategory:delete',

}
