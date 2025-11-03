import { betterAuth } from 'better-auth';
import { BetterAuthOptions } from 'better-auth/types';
import { mikroOrmAdapter } from "better-auth-mikro-orm"
import mikroOrmConfig from 'mikro-orm.config';

export const authConfig: BetterAuthOptions = {
  database: mikroOrmAdapter(mikroOrmConfig),
  
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set to true if you want email verification
  },
  

  socialProviders: {
    google: {
      clientId: process.env.AUTH_GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET || '',
      redirectURI:  'http://localhost:3000/api/auth/callback/google',
    },
  },

  session: {
    // Use Redis for session storage
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

  advanced: {
    useSecureCookies: process.env.NODE_ENV === 'production',
  },
};

export const auth = betterAuth(authConfig);

