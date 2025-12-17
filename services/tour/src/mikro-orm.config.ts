import { MikroOrmModuleSyncOptions } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { SeedManager } from '@mikro-orm/seeder';
import { Category } from './category/entities/category.entity';
import { SubCategory } from './sub-category/entities/sub-category';
import { Tour } from './tour/tour.entity';
import { TourSubcategory } from './tour-subcategory/entities/tour-subcategory.entity';
import { TourTimeSlot } from './tour-time-slot/entities/tour-time-slot.entity';
import { Booking } from './booking/entities/booking.entity';
import { join } from 'path';

const microOrmConfig: MikroOrmModuleSyncOptions = {
  clientUrl: process.env.DATABASE_URL, // Connection URL
  entities: [
    Category,
    SubCategory,
    Tour,
    TourSubcategory,
    TourTimeSlot,
    Booking,
  ],
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
