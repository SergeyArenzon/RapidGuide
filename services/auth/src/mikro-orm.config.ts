import { MikroOrmModuleSyncOptions } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { User } from './entities/user.entity';
import { Session } from './entities/session.entity';
import { Account } from './entities/account.entity';
import { Verification } from './entities/verification.entity';
import { join } from 'path';

const mikroOrmConfig: MikroOrmModuleSyncOptions = {
  entities: [User, Session, Account, Verification],
  dbName: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  driver: PostgreSqlDriver,
  debug: process.env.NODE_ENV !== 'production',
  allowGlobalContext: true, // Allow global context for better-auth integration
  migrations: {
    path: join(__dirname, 'migrations'),
    tableName: 'mikro_orm_migrations',
  },
};

export default mikroOrmConfig;

