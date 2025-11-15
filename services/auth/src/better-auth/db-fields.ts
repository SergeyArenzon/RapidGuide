const userFields = {
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  removedAt: 'removedAt',
  email: 'email',
  emailVerified: 'emailVerified',
  name: 'name',
  image: 'image',
};
const accountFields = {
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
};
const sessionFields = {
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  token: 'token',
  expiresAt: 'expiresAt',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  userId: 'userId',
};

const verificationFields = {
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  identifier: 'identifier',
  value: 'value',
  expiresAt: 'expiresAt',
  userId: 'userId',
};

export { userFields, accountFields, sessionFields, verificationFields };
