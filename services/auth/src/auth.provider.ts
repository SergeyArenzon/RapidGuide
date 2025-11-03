import { Provider } from '@nestjs/common';
import { betterAuth } from 'better-auth';
import { mikroOrmAdapter } from 'better-auth-mikro-orm';
import { MikroORM } from '@mikro-orm/core';
import { BetterAuthOptions } from 'better-auth/types';

// Token for dependency injection
export const BETTER_AUTH_TOKEN = 'BETTER_AUTH';

// Factory function to create Better Auth instance
export const createBetterAuthFactory = (orm: MikroORM) => {
  const authConfig: BetterAuthOptions = {
    database: mikroOrmAdapter(orm),

    socialProviders: {
      google: {
        clientId: process.env.AUTH_GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET || '',
        redirectURI: process.env.AUTH_GOOGLE_REDIRECT_URI || 'http://localhost:3001/api/auth/callback/google',
      },
    },

    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // 1 day
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60, // 5 minutes
      },
    },

    user: {
      additionalFields: {
        testField: {
          type: 'string',
          required: false,
        },
      },
    },

    trustedOrigins: [
      process.env.CLIENT_URL || 'http://localhost:3000'
    ],
  };

  return betterAuth(authConfig);
};

// Provider configuration using useFactory
export const BetterAuthProvider: Provider = {
  provide: BETTER_AUTH_TOKEN,
  useFactory: createBetterAuthFactory,
  inject: [MikroORM],
};

// Type for the Better Auth instance
export type BetterAuthInstance = ReturnType<typeof betterAuth>;