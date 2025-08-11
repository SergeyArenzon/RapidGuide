import { MikroOrmModuleSyncOptions } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { User } from './user/user.entity';
import { Traveller } from './traveller/traveller.entity';
import { Languages } from './languages/languages.entity';
import { Guide } from './guide/entities/guide.entity';
import { SeedManager } from '@mikro-orm/seeder';
import { Country } from './country/country.entity';
import { City } from './city/city.entity';
import { GuideSubcategory } from './guide/entities/guide-subcategory.entity';
import { join } from 'path';

const microOrmConfig: MikroOrmModuleSyncOptions = {
  clientUrl: process.env.USER_DB_HOST, // Connection URL
  entities: [
    User,
    Traveller,
    Languages,
    Guide,
    GuideSubcategory,
    Country,
    City,
  ],
  driver: PostgreSqlDriver, // Specify PostgreSQL driver
  migrations: {
    path: join(__dirname, 'database/migrations'), // Use absolute path
  },
  extensions: [SeedManager],
  seeder: {
    path: join(__dirname, 'database/seeder'), // Use absolute path
    pathTs: join(__dirname, 'database/seeder'), // Use absolute path
    defaultSeeder: 'MainSeeder',
  },
  debug: true, // Enable for development
};
export default microOrmConfig;
