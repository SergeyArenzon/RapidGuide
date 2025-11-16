import { Injectable } from '@nestjs/common';
import { GetProfilesResponseDto } from '@rapid-guide-io/contracts';

@Injectable()
export class ScopeService {
    
/**
 * Pure utility function for scope generation.
 * Can be used independently of the service for testing or other use cases.
 *
 * Optimized scope generation using wildcards to reduce JWT size.
 * Instead of listing every action, use wildcards for full resource access.
 */
    getScopes(
        profiles: GetProfilesResponseDto,
    ): string[] {
        const scopes: string[] = [];
    
        // Guide profile scopes - use wildcards for full access
        if (profiles.guide) {
            scopes.push(
                'guide:*', // Full guide access (read, create, update, delete)
                'tour:*', // Full tour access
                'category:read',
                'subcategory:read',
                'language:read',
                'country:read',
                'city:read',
            );
        }
    
        // Traveller profile scopes (if you have a traveller profile)
        // if (profiles.traveller) {
        //   scopes.push(
        //     'traveller:*', // Full traveller access
        //     'tour:read', // Travellers can only read tours, not create
        //   );
        // }
    
    
        // Remove duplicates and return
        return [...new Set(scopes)];
    }
}
