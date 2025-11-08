import { mikroOrmAdapter } from 'better-auth-mikro-orm';
import { betterAuth } from 'better-auth';
import { MikroORM } from '@mikro-orm/core';

export function createAuth(orm: MikroORM) {
  return betterAuth({
    database: mikroOrmAdapter(orm),
    basePath: '/auth',
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
