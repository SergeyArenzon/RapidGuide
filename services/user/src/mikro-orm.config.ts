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
    path: './database/migrations', // Ensure migrations are inside src
  },
  extensions: [SeedManager],
  seeder: {
    path: './database/seeder',
    pathTs: './database/seeder',
    defaultSeeder: 'MainSeeder',
  },
  debug: true, // Enable for development
};
export default microOrmConfig;
