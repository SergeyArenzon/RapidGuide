import { mikroOrmAdapter } from 'better-auth-mikro-orm';
import { betterAuth } from 'better-auth';
import { MikroORM } from '@mikro-orm/core';

export function createAuth(orm: MikroORM) {
  return betterAuth({
    database: mikroOrmAdapter(orm),
    basePath: '/auth',
    trustedOrigins: ['*'],
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        redirectURI: "http://localhost:80/api/v1/auth/auth/callback/google"
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
