/**
 * Centralized query key factories
 * 
 * This file provides type-safe query key factories for all queries in the application.
 * Using factories ensures consistency and makes it easier to invalidate related queries.
 */

export const queryKeys = {
  // Auth & Session
  session: () => ['session'] as const,
  
  // Profile
  profile: {
    me: (jwt?: string) => ['profile', 'me', jwt] as const,
    countries: () => ['countries'] as const,
    cities: () => ['cities'] as const,
    languages: () => ['languages'] as const,
  },
  
  // Tours
  tours: {
    all: () => ['tours'] as const,
    detail: (tourId: string) => ['tour', tourId] as const,
    categories: () => ['categories'] as const,
    subcategories: () => ['subcategories'] as const,
    // Legacy alias for subcategories (to be migrated)
    subCategories: () => ['subCategories'] as const,
  },
} as const;

