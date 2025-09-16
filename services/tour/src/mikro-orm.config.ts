import { MikroOrmModuleSyncOptions } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { SeedManager } from '@mikro-orm/seeder';
import { Category } from './category/entities/category.entity';
import { SubCategory } from './sub-category/entities/sub-category';
import { join } from 'path';

const microOrmConfig: MikroOrmModuleSyncOptions = {
  clientUrl: process.env.DATABASE_URL || 'postgresql://tour_user:tour_password@localhost:5432/tour_db', // Connection URL with fallback
  entities: [Category, SubCategory],
  driver: PostgreSqlDriver, // Specify PostgreSQL driver
  migrations: {
    path: join(__dirname, 'database/migrations'), // Ensure migrations are inside src
  },
  extensions: [SeedManager],
  seeder: {
    path: join(__dirname, 'database/seeder'),
    pathTs: join(__dirname, 'database/seeder'),
  },
  debug: true, // Enable for development
};
export default microOrmConfig;
