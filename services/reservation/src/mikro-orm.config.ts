import { MikroOrmModuleSyncOptions } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { join } from 'path';
import { Reservation } from './reservation/entities/reservation.entity';
import { ReservationTraveller } from './reservation/entities/reservation-traveller.entity';
import { ReservationAvailability } from './reservation/entities/reservation-availability.entity';

// Determine if we're running from compiled code (dist) or source (src)
const isCompiled = __dirname.includes('dist');
const migrationsPath = isCompiled 
  ? join(__dirname, 'database/migrations') // Production: dist/database/migrations
  : join(process.cwd(), 'src', 'database', 'migrations'); // Development: src/database/migrations

const microOrmConfig: MikroOrmModuleSyncOptions = {
  clientUrl: process.env.DATABASE_URL, // Connection URL
  entities: [Reservation, ReservationTraveller, ReservationAvailability],
  driver: PostgreSqlDriver, // Specify PostgreSQL driver
  migrations: {
    path: migrationsPath,
    pathTs: join(process.cwd(), 'src', 'database', 'migrations'), // TypeScript migrations for CLI
  },
  debug: true, // Enable for development
};
export default microOrmConfig;
