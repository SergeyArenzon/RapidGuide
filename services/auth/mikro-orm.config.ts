import { MikroOrmModuleSyncOptions } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { User } from './src/entities/user.entity';
import { Session } from './src/entities/session.entity';
import { Account } from './src/entities/account.entity';
import { Verification } from './src/entities/verification.entity';
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
  migrations: {
    path: join(__dirname, 'migrations'),
    tableName: 'mikro_orm_migrations',
  },
};

export default mikroOrmConfig;

