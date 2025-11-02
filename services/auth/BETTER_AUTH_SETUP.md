# Better Auth Integration Guide

This guide explains how Better Auth has been integrated into the auth service and how to use it.

## What is Better Auth?

Better Auth is a TypeScript-first authentication library that provides:
- ✅ Multiple authentication methods (email/password, OAuth, magic links)
- ✅ Built-in session management
- ✅ Database integration (PostgreSQL, MySQL, SQLite)
- ✅ TypeScript support with full type safety
- ✅ Plugin system for extensibility
- ✅ Automatic API endpoints generation

## Setup Complete

The following files have been configured:

1. **`auth.config.ts`** - Better Auth configuration
2. **`app.module.ts`** - AuthModule integration
3. **`main.ts`** - Disabled default body parser (required for Better Auth)
4. **`better-auth.controller.ts`** - Example usage of Better Auth guards and decorators

## Required Environment Variables

Add these to your `.env` file:

```env
# Database Configuration (PostgreSQL)
DATABASE_URL=postgresql://user:password@localhost:5432/auth_db

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback/google

# Better Auth Configuration
BETTER_AUTH_SECRET=your-better-auth-secret-key
BETTER_AUTH_URL=http://localhost:3000
```

## Database Setup

Better Auth requires database tables for users, sessions, and accounts. Run migrations:

```bash
# Generate migration
npx better-auth generate

# Run migration
npx better-auth migrate
```

Or create tables manually:

```sql
-- Users table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  name TEXT,
  image TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  expires_at TIMESTAMP NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Accounts table (for OAuth)
CREATE TABLE accounts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  provider TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(provider, provider_account_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## API Endpoints

Better Auth automatically provides these endpoints:

### Authentication
- `POST /api/auth/sign-up/email` - Email/password sign up
- `POST /api/auth/sign-in/email` - Email/password sign in
- `POST /api/auth/sign-out` - Sign out

### OAuth
- `GET /api/auth/sign-in/social` - Initiate OAuth flow
- `GET /api/auth/callback/:provider` - OAuth callback (e.g., `/api/auth/callback/google`)

### Session
- `GET /api/auth/session` - Get current session

## Usage Examples

### Protecting Routes

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard, GetSession } from '@thallesp/nestjs-better-auth';
import { Session } from 'better-auth/types';

@Controller('protected')
export class ProtectedController {
  @Get()
  @UseGuards(AuthGuard)
  async getProtectedResource(@GetSession() session: Session) {
    return {
      message: 'This is protected',
      user: session.user,
    };
  }
}
```

### Getting Current User

```typescript
@Get('profile')
@UseGuards(AuthGuard)
async getProfile(@GetSession() session: Session) {
  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
  };
}
```

### Custom Authentication Logic

```typescript
import { Inject } from '@nestjs/common';
import { BETTER_AUTH } from '@thallesp/nestjs-better-auth';
import { BetterAuth } from 'better-auth/types';

export class MyService {
  constructor(
    @Inject(BETTER_AUTH) private auth: BetterAuth,
  ) {}

  async customAuth() {
    // Access Better Auth API directly
    const session = await this.auth.api.getSession({ 
      headers: { /* ... */ } 
    });
    
    return session;
  }
}
```

## Client-Side Integration

### Sign In with Email/Password

```typescript
const response = await fetch('http://localhost:3000/api/auth/sign-in/email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include', // Important for cookies
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
  }),
});

const data = await response.json();
```

### Sign In with Google

```typescript
// Redirect to Google OAuth
window.location.href = 'http://localhost:3000/api/auth/sign-in/social?provider=google';

// Or use a button
<a href="http://localhost:3000/api/auth/sign-in/social?provider=google">
  Sign in with Google
</a>
```

### Get Current Session

```typescript
const response = await fetch('http://localhost:3000/api/auth/session', {
  credentials: 'include',
});

const session = await response.json();
```

### Sign Out

```typescript
const response = await fetch('http://localhost:3000/api/auth/sign-out', {
  method: 'POST',
  credentials: 'include',
});
```

## Migration from Existing Auth System

Your existing auth system (AccessTokenModule, RefreshTokenModule) is still active for backward compatibility. 

### Migration Steps:

1. **Set up database tables** (see above)
2. **Configure environment variables**
3. **Test Better Auth endpoints** using the examples above
4. **Update client applications** to use Better Auth endpoints
5. **Migrate existing users** (if needed):
   ```typescript
   // Example migration script
   async function migrateUsers() {
     const existingUsers = await getExistingUsers();
     
     for (const user of existingUsers) {
       await betterAuth.api.createUser({
         email: user.email,
         name: user.name,
         // ... other fields
       });
     }
   }
   ```
6. **Remove old auth modules** once migration is complete

## Advanced Features

### Custom User Fields

Already configured in `auth.config.ts`:
```typescript
user: {
  additionalFields: {
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    imageUrl: { type: 'string' },
  },
}
```

### Role-Based Access Control (RBAC)

```typescript
// Add roles to user model
user: {
  additionalFields: {
    role: { 
      type: 'string',
      default: 'user',
    },
  },
}

// Check role in guard
@Get('admin')
@UseGuards(AuthGuard)
async adminEndpoint(@GetSession() session: Session) {
  if (session.user.role !== 'admin') {
    throw new ForbiddenException();
  }
  // ...
}
```

### Redis Session Storage

You can integrate Redis for session storage:
```typescript
// In auth.config.ts
import { RedisAdapter } from 'better-auth/adapters/redis';

session: {
  adapter: new RedisAdapter({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
  }),
}
```

## Troubleshooting

### Issue: "Body parser middleware is interfering"
**Solution:** Make sure `bodyParser: false` is set in `main.ts` (already done)

### Issue: "Session not found"
**Solution:** Ensure cookies are being sent with `credentials: 'include'` on the client

### Issue: "CORS errors"
**Solution:** Configure CORS in `main.ts`:
```typescript
app.enableCors({ 
  credentials: true, 
  origin: 'http://your-frontend-url.com' 
});
```

### Issue: "Database connection failed"
**Solution:** Verify `DATABASE_URL` in your `.env` file

## Resources

- [Better Auth Documentation](https://better-auth.com)
- [NestJS Better Auth Package](https://github.com/thallesp/nestjs-better-auth)
- [Better Auth GitHub](https://github.com/better-auth/better-auth)

## Next Steps

1. ✅ Better Auth is now integrated
2. ⏳ Set up environment variables
3. ⏳ Run database migrations
4. ⏳ Test the endpoints
5. ⏳ Update client applications
6. ⏳ Migrate existing users (if any)

