import { betterAuth } from 'better-auth';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { jwt } from 'better-auth/plugins';
import { mikroOrmAdapter } from 'better-auth-mikro-orm';
import { MikroORM } from '@mikro-orm/core';
import {
  ACCOUNT_FIELDS,
  SESSION_FIELDS,
  USER_FIELDS,
  VERIFICATION_FIELDS,
} from './better-auth.consts';

export type AuthInstance = ReturnType<typeof betterAuth>;

const fetchProfiles = async (userId: string, httpService: HttpService) => {
  const { data } = await firstValueFrom(
    httpService.get<{ scopes: string[] }>(`http://profile:3000`, {
      params: { userId },
    }),
  );

  return data;
};

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
            const scopes = ['profile:read', 'profile:write'];

            // try {
            //   const data = await fetchProfiles(session.user.id, httpService);

            //   scopes = data.scopes ?? scopes;
            // } catch {
            //   // keep default scopes if the remote request fails
            // }

            return {
              id: session.user.id,
              sub: session.user.id,
              exp: session.session.expiresAt,
              email: session.user.email,
              roles: ['user'],
              iat: session.session.createdAt,
              nbf: session.session.createdAt,
              aud: ['profile-svc', 'tour-svc'],
              scopes,
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
