# MikroORM + Better Auth Setup

This guide explains how MikroORM has been integrated with Better Auth in the auth service.

## ✅ What's Been Configured

### Files Created:

1. **`src/mikro-orm.config.ts`** - MikroORM configuration for the app
2. **`mikro-orm.config.ts`** - MikroORM CLI configuration (in project root)
3. **`src/entities/user.entity.ts`** - User entity for authentication
4. **`src/entities/session.entity.ts`** - Session entity
5. **`src/entities/account.entity.ts`** - OAuth account entity

### Files Updated:

1. **`src/app.module.ts`** - Added MikroOrmModule
2. **`package.json`** - Added MikroORM CLI scripts

## 🚀 Quick Start

### Step 1: Create the Database Schema

Run this command to create all tables:

```bash
cd /Users/sergeyarenzon/dev/HuddleHub/services/auth
pnpm run schema:create
```

Or if you prefer migrations:

```bash
pnpm run migration:create
pnpm run migration:up
```

### Step 2: Start the Service

```bash
pnpm run start:dev
```

The error should now be resolved! ✅

## 📊 Database Schema

MikroORM will create these tables:

### `users` table
- `id` (TEXT, PRIMARY KEY)
- `email` (TEXT, UNIQUE)
- `email_verified` (BOOLEAN)
- `name` (TEXT, nullable)
- `image` (TEXT, nullable)
- `password_hash` (TEXT, nullable)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### `sessions` table
- `id` (TEXT, PRIMARY KEY)
- `user_id` (TEXT, FOREIGN KEY → users.id)
- `expires_at` (TIMESTAMP)
- `ip_address` (TEXT, nullable)
- `user_agent` (TEXT, nullable)
- `created_at` (TIMESTAMP)

### `accounts` table (for OAuth)
- `id` (TEXT, PRIMARY KEY)
- `user_id` (TEXT, FOREIGN KEY → users.id)
- `provider` (TEXT) - e.g., 'google', 'github'
- `provider_account_id` (TEXT)
- `access_token` (TEXT, nullable)
- `refresh_token` (TEXT, nullable)
- `expires_at` (TIMESTAMP, nullable)
- `created_at` (TIMESTAMP)
- UNIQUE constraint on (`provider`, `provider_account_id`)

## 🛠 MikroORM Commands

### Schema Management

```bash
# Create schema (tables) from entities
pnpm run schema:create

# Update schema (add/modify columns)
pnpm run schema:update
```

### Migration Management

```bash
# Create a new migration based on entity changes
pnpm run migration:create

# Run pending migrations
pnpm run migration:up

# Rollback last migration
pnpm run migration:down
```

## 💻 Using MikroORM in Your Code

### Inject EntityManager

```typescript
import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly em: EntityManager,
  ) {}

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.em.findOne(User, { email });
  }

  async createUser(email: string, name?: string): Promise<User> {
    const user = new User();
    user.email = email;
    user.name = name;
    
    await this.em.persistAndFlush(user);
    return user;
  }
}
```

### Inject Specific Repository

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.findAll();
  }
}
```

## 🔗 How MikroORM Works with Better Auth

1. **MikroORM manages the database schema** - creates and maintains tables
2. **Better Auth uses the same database** - connects to the same PostgreSQL database
3. **Entities match Better Auth's requirements** - User, Session, Account tables are compatible
4. **Both systems can work together** - You can query using MikroORM while Better Auth handles authentication

## 🌍 Environment Variables

Make sure these are set:

```env
# Database Configuration
DB_HOST=auth-db
DB_PORT=5432
DB_NAME=auth
DB_USER=postgres
DB_PASSWORD=postgres

# Or use a connection URL
DATABASE_URL=postgresql://postgres:postgres@auth-db:5432/auth
```

## 📝 Adding New Entities

### 1. Create Entity File

```typescript
// src/entities/my-entity.entity.ts
import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';

@Entity({ tableName: 'my_entities' })
export class MyEntity {
  @PrimaryKey({ type: 'text' })
  id: string = v4();

  @Property({ type: 'text' })
  name!: string;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();
}
```

### 2. Add to MikroORM Config

```typescript
// src/mikro-orm.config.ts
import { MyEntity } from './entities/my-entity.entity';

export default defineConfig({
  entities: [User, Session, Account, MyEntity], // Add here
  // ... rest of config
});
```

### 3. Generate Migration

```bash
pnpm run migration:create
pnpm run migration:up
```

## 🔍 Querying Data

### Basic Queries

```typescript
// Find one
const user = await em.findOne(User, { email: 'user@example.com' });

// Find many
const users = await em.find(User, { emailVerified: true });

// Find with relations
const user = await em.findOne(User, { id: '123' }, {
  populate: ['sessions', 'accounts']
});
```

### Advanced Queries

```typescript
// With conditions
const users = await em.find(User, {
  $or: [
    { email: { $like: '%@gmail.com' } },
    { emailVerified: true }
  ]
});

// With ordering and pagination
const users = await em.find(User, {}, {
  orderBy: { createdAt: 'DESC' },
  limit: 10,
  offset: 0,
});
```

## 🐛 Troubleshooting

### Error: "Failed to initialize database adapter"

**Solution:** Run `pnpm run schema:create` to create the tables first.

### Error: "Table already exists"

**Solution:** Use `pnpm run schema:update` instead of `schema:create`.

### Error: "Connection refused"

**Solution:** Make sure your `auth-db` pod/container is running:
```bash
kubectl get pods | grep auth-db
# or
docker ps | grep auth-db
```

### Error: "Cannot find module '@mikro-orm/core'"

**Solution:** Reinstall dependencies:
```bash
pnpm install
```

## 📚 Resources

- [MikroORM Documentation](https://mikro-orm.io/)
- [MikroORM NestJS Integration](https://mikro-orm.io/docs/usage-with-nestjs)
- [Better Auth Documentation](https://better-auth.com)

## 🎯 Next Steps

1. ✅ MikroORM is configured
2. ✅ Entities are created
3. ⏳ Run `pnpm run schema:create` to create tables
4. ⏳ Start the service with `pnpm run start:dev`
5. ⏳ Test Better Auth endpoints (see `BETTER_AUTH_SETUP.md`)

