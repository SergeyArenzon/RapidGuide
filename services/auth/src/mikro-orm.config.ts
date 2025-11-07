import { MikroOrmModuleSyncOptions } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { User } from './entities/user.entity';
import { Session } from './entities/session.entity';
import { Account } from './entities/account.entity';
import { Verification } from './entities/verification.entity';
import { join } from 'path';
import { AbstractNamingStrategy } from '@mikro-orm/core';

export class CamelCaseNamingStrategy extends AbstractNamingStrategy {
  classToTableName(entityName: string): string {
    // Keep entity name as table name (no plural, no underscores)
    return entityName;
  }

  joinColumnName(propertyName: string): string {
    // Keep foreign key column name in camelCase
    return propertyName;
  }

  joinKeyColumnName(entityName: string, referencedColumnName?: string): string {
    // Example: userId
    return referencedColumnName ?? `${entityName}Id`;
  }

  joinTableName(
    sourceEntity: string,
    targetEntity: string,
    propertyName: string,
  ): string {
    // For many-to-many tables, keep camelCase
    return `${sourceEntity}_${propertyName}_${targetEntity}`;
  }

  propertyToColumnName(propertyName: string): string {
    // Keep property names as-is
    return propertyName;
  }

  referenceColumnName(): string {
    return 'id';
  }

  indexName(tableName: string, columns: string[]): string {
    return `idx_${tableName}_${columns.join('_')}`;
  }

  uniqueConstraintName(tableName: string, columns: string[]): string {
    return `uq_${tableName}_${columns.join('_')}`;
  }

  foreignKeyName(tableName: string, columnName: string): string {
    return `fk_${tableName}_${columnName}`;
  }
}

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
  namingStrategy: CamelCaseNamingStrategy,
  migrations: {
    path: join(__dirname, 'migrations'),
    tableName: 'mikro_orm_migrations',
  },
};

export default mikroOrmConfig;
