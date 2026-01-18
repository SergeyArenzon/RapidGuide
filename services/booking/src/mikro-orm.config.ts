import { MikroOrmModuleSyncOptions } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { join } from 'path';
import { Reservation } from './booking/entities/reservation.entity';
import { ReservationTraveller } from './booking/entities/reservation-traveller.entity';
import { ReservationAvailability } from './booking/entities/reservation-availability.entity';

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
