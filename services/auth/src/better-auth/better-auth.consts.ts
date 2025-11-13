export const USER_FIELDS = {
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  removedAt: 'removedAt',
  email: 'email',
  emailVerified: 'emailVerified',
  name: 'name',
  image: 'image',
} as const;

export const ACCOUNT_FIELDS = {
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
} as const;

export const SESSION_FIELDS = {
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  token: 'token',
  expiresAt: 'expiresAt',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  userId: 'userId',
} as const;

export const VERIFICATION_FIELDS = {
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  identifier: 'identifier',
  value: 'value',
  expiresAt: 'expiresAt',
  userId: 'userId',
} as const;
