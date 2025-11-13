import { mikroOrmAdapter } from 'better-auth-mikro-orm';
import { betterAuth } from 'better-auth';
import { MikroORM } from '@mikro-orm/core';
import { jwt } from 'better-auth/plugins';

export type AuthInstance = ReturnType<typeof betterAuth>;

export function createAuth(orm: MikroORM): AuthInstance {
  return betterAuth({
    database: mikroOrmAdapter(orm),
    basePath: '/auth',
    plugins: [
      jwt({
        jwt: {
          issuer: 'auth-svc',
          definePayload(session) {
            return {
              id: session.user.id,
              sub: session.user.id,
              exp: session.session.expiresAt,
              email: session.user.email,
              roles: ['user'],
              iat: session.session.createdAt,
              nbf: session.session.createdAt,
              aud: ['profile-svc', 'tour-svc'],
              scopes: ['profile:read', 'profile:write'],
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
      fields: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        removedAt: 'removedAt',
        email: 'email',
        emailVerified: 'emailVerified',
        name: 'name',
        image: 'image',
      },
    },
    account: {
      fields: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        accountId: 'accountId',
        providerId: 'providerId',
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        accessTokenExpiresAt: 'accessTokenExpiresAt',
        refreshTokenExpiresAt: 'refreshTokenExpiresAt',
        scope: 'scope',
        password: 'password',
        userId: 'userId',
        idToken: 'idToken',
      },
    },
    session: {
      fields: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        token: 'token',
        expiresAt: 'expiresAt',
        ipAddress: 'ipAddress',
        userAgent: 'userAgent',
        userId: 'userId',
      },
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60, // Cache duration in seconds
      },
    },
    verification: {
      fields: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        identifier: 'identifier',
        value: 'value',
        expiresAt: 'expiresAt',
        userId: 'userId',
      },
    },
    // Don't forget to disable the ID generator if it is already managed by MikroORM
    advanced: {
      database: {
        generateId: false,
      },
    },
  });
}

