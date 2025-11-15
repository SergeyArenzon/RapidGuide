import { betterAuth } from 'better-auth';
import { HttpService } from '@nestjs/axios';
import { jwt } from 'better-auth/plugins';
import { mikroOrmAdapter } from 'better-auth-mikro-orm';
import { MikroORM } from '@mikro-orm/core';
import {
  ACCOUNT_FIELDS,
  SESSION_FIELDS,
  USER_FIELDS,
  VERIFICATION_FIELDS,
} from './better-auth.consts';
import { fetchProfiles, getRoles, getScopes } from './permission';

export type AuthInstance = ReturnType<typeof betterAuth>;

export function createAuth(
  orm: MikroORM,
  httpService: HttpService,
): AuthInstance {
  return betterAuth({
    database: mikroOrmAdapter(orm),
    basePath: '/auth',
    plugins: [
      jwt({
        jwt: {
          issuer: 'auth-svc',
          definePayload: async (session) => {
            // Default scopes if profile fetch fails (empty array - user has no permissions)
            let scopes: string[] = [];
            let roles: string[] = [];

            try {
              const profiles = await fetchProfiles(
                session.user.id,
                httpService,
              );
              scopes = getScopes(profiles);
              roles = getRoles(profiles);
            } catch (error) {
              console.error({ error });
              // Keep default scopes if the remote request fails
              // In production, you might want to log this but not throw
            }

            return {
              roles,
              scopes, // Array of strings like ['guide:read', 'tour:create', ...]
              id: session.user.id,
              sub: session.user.id,
              exp: session.session.expiresAt,
              email: session.user.email,
              iat: session.session.createdAt,
              nbf: session.session.createdAt,
              aud: ['profile-svc', 'tour-svc'],
              jti: session.session.token,
            };
          },
        },
      }),
    ],
    trustedOrigins: ['http://localhost:3000', 'http://localhost'],
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        redirectURI: process.env.GOOGLE_REDIRECT_URI,
      },
    },
    user: {
      fields: USER_FIELDS,
    },
    account: {
      fields: ACCOUNT_FIELDS,
    },
    session: {
      fields: SESSION_FIELDS,
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60, // Cache duration in seconds
      },
    },
    verification: {
      fields: VERIFICATION_FIELDS,
    },
    // Don't forget to disable the ID generator if it is already managed by MikroORM
    advanced: {
      database: {
        generateId: false,
      },
    },
  });
}
