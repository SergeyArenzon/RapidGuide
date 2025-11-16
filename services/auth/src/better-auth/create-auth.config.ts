import { betterAuth } from 'better-auth';
import { jwt } from 'better-auth/plugins';
import { mikroOrmAdapter } from 'better-auth-mikro-orm';
import { MikroORM } from '@mikro-orm/core';
import {
  ACCOUNT_FIELDS,
  SESSION_FIELDS,
  USER_FIELDS,
  VERIFICATION_FIELDS,
} from './better-auth.consts';
import { PermissionService } from '../permission/permission.service';

export type AuthInstance = ReturnType<typeof betterAuth>;

export function createAuth(
  orm: MikroORM,
  permissionService: PermissionService,
): AuthInstance {
  return betterAuth({
    database: mikroOrmAdapter(orm),
    basePath: '/auth',
    plugins: [
      jwt({
        jwt: {
          definePayload: async ({ user, session }) => {
            // Default scopes if profile fetch fails (empty array - user has no permissions)
            try {
              const { roles, scopes } = await permissionService.getPermissions(user.id); 
              return permissionService.createJwtTokenPayload(session, user, roles, scopes);
            } catch {
              // Error is already logged by PermissionService
              // Keep default scopes if the remote request fails

              // In production, you might want to log this but not throw
            }

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
