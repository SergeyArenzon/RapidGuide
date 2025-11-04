import { mikroOrmAdapter } from 'better-auth-mikro-orm';
import { betterAuth } from 'better-auth';
import { MikroORM } from '@mikro-orm/core';

export function createAuth(orm: MikroORM) {
  return betterAuth({
    database: mikroOrmAdapter(orm),

    // Don't forget to disable the ID generator if it is already managed by MikroORM
    advanced: {
      database: {
        generateId: false
      }
    }
  })
}