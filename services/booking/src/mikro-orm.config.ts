import { MikroOrmModuleSyncOptions } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { join } from 'path';
import { Reservation } from './reservation/entities/reservation.entity';
import { ReservationTraveller } from './reservation/entities/reservation-traveller.entity';
import { ReservationAvailability } from './reservation/entities/reservation-availability.entity';

const microOrmConfig: MikroOrmModuleSyncOptions = {
  clientUrl: process.env.DATABASE_URL, // Connection URL
  entities: [Reservation, ReservationTraveller, ReservationAvailability],
  driver: PostgreSqlDriver, // Specify PostgreSQL driver
  migrations: {
    path: join(__dirname, 'database/migrations'), // Ensure migrations are inside src
  },
  debug: true, // Enable for development
};
export default microOrmConfig;
