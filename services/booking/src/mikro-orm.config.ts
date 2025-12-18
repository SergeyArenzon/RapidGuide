import { MikroOrmModuleSyncOptions } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Booking } from './booking/entities/booking.entity';
import { BookingTraveller } from './booking/entities/booking-traveller.entity';
import { join } from 'path';

const microOrmConfig: MikroOrmModuleSyncOptions = {
  clientUrl: process.env.DATABASE_URL, // Connection URL
  entities: [Booking, BookingTraveller],
  driver: PostgreSqlDriver, // Specify PostgreSQL driver
  migrations: {
    path: join(__dirname, 'database/migrations'), // Ensure migrations are inside src
  },
  debug: true, // Enable for development
};
export default microOrmConfig;
