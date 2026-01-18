import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import microOrmConfig from './mikro-orm.config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ReservationModule } from './reservation/reservation.module';

@Module({
  imports: [MikroOrmModule.forRoot(microOrmConfig), ReservationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
