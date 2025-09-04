import { SetMetadata } from '@nestjs/common';

export const SCOPES_KEY = 'scopes';
export const Scopes = (scopes: string[]) => SetMetadata(SCOPES_KEY, scopes);


export const enum SCOPE_PERMISSION {
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
    TOUR_DELETE = 'tour:delete'
}
