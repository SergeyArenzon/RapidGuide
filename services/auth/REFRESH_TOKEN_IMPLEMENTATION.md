# Refresh Token Implementation with Redis

This document explains how refresh tokens are implemented in the auth service using Redis for storage and management.

## Overview

The refresh token system provides a secure way to maintain user sessions without requiring re-authentication every time an access token expires. Refresh tokens are stored in Redis with configurable TTL (Time To Live).

## How It Works

### 1. Sign In Process
When a user signs in:
- User authenticates with their credentials
- Access token is generated (short-lived, e.g., 15 minutes)
- Refresh token is generated (long-lived, e.g., 7 days)
- Refresh token is stored in Redis with user data
- Both tokens are set as HTTP-only cookies

### 2. Token Refresh Process
When an access token expires:
- Client sends refresh token to `/refresh` endpoint
- Service validates refresh token against Redis
- If valid, generates new access token
- New access token is set as cookie
- Refresh token remains unchanged

### 3. Logout Process
When a user logs out:
- Refresh token is revoked from Redis
- Both cookies are cleared
- User session is terminated

## API Endpoints

### POST `/` (Sign In)
- Generates access and refresh tokens
- Stores refresh token in Redis
- Sets both tokens as cookies

### POST `/refresh`
- Validates refresh token from Redis
- Generates new access token
- Sets new access token cookie

### POST `/logout`
- Revokes specific refresh token from Redis
- Clears cookies

### POST `/logout-all`
- Revokes all refresh tokens for a specific user
- Useful for security incidents or password changes

## Redis Storage

Refresh tokens are stored in Redis with the following structure:
- **Key format**: `refresh_token:{token}`
- **Value**: JSON stringified user data
- **TTL**: Configurable via `JWT_REFRESH_EXPIRES_IN` environment variable

## Environment Variables

```bash
# Redis Configuration
REDIS_HOST=redis-host
REDIS_PORT=6379
REDIS_PASSWORD=redis-password
REDIS_DB=0

# JWT Configuration
JWT_ACCESS_EXPIRES_IN_MS=15m      # Access token expiration (15 minutes)
JWT_REFRESH_EXPIRES_IN_MS=7d      # Refresh token expiration (7 days)
```

## Security Features

1. **HTTP-only Cookies**: Tokens are stored in HTTP-only cookies to prevent XSS attacks
2. **Secure Cookies**: Cookies are marked as secure for HTTPS-only transmission
3. **Token Revocation**: Refresh tokens can be immediately revoked from Redis
4. **Session Management**: Support for logging out from all sessions
5. **Automatic Expiration**: Redis TTL ensures tokens automatically expire

## Usage Examples

### Client-side Token Refresh
```typescript
// When access token expires, call refresh endpoint
const response = await fetch('/auth/refresh', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    refreshToken: getCookie('refreshToken')
  }),
  credentials: 'include' // Important for cookies
});

if (response.ok) {
  // New access token is automatically set as cookie
  // Continue with authenticated requests
}
```

### Logout
```typescript
// Logout from current session
await fetch('/auth/logout', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    refreshToken: getCookie('refreshToken')
  }),
  credentials: 'include'
});

// Logout from all sessions
await fetch('/auth/logout-all', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    userId: 'user-id'
  }),
  credentials: 'include'
});
```

## Testing

Use the `/test` endpoint to verify Redis connectivity:
```bash
curl http://localhost:3000/test
```

This will test Redis operations and return the results.

## Monitoring

The service logs all refresh token operations:
- Token generation and storage
- Token validation
- Token revocation
- Redis operation failures

Check logs for any Redis connectivity issues or token validation problems.
