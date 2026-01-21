import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import {
  CreateReservationDto,
  GetReservationsFilterDto,
  ReservationDto,
  reservationStatusSchema,
  UpdateReservationDto,
} from '@rapid-guide-io/contracts';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import { Reservation } from './entities/reservation.entity';
import { ReservationTraveller } from './entities/reservation-traveller.entity';
import { ReservationAvailability } from './entities/reservation-availability.entity';

dayjs.extend(utc);

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: EntityRepository<Reservation>,
    private readonly em: EntityManager,
  ) {}

  async create(
    createReservationDto: CreateReservationDto,
  ): Promise<ReservationDto> {
    const em = this.em.fork();

    // Create the reservation entity
    const reservation = new Reservation({
      tour_id: createReservationDto.tour_id,
      datetime: createReservationDto.datetime,
      price_per_traveller: createReservationDto.price_per_traveller, // Will be set from tour if not provided
      status: reservationStatusSchema.enum.pending,
    });

    // Create ReservationTraveller entity for the traveller
    const reservationTraveller = new ReservationTraveller({
      reservation,
      traveller_id: createReservationDto.traveller_id,
    });
    reservation.travellers.add(reservationTraveller);
    em.persist(reservationTraveller);

    // Create ReservationAvailability entities for each availability with slot_order
    createReservationDto.availability_ids.forEach((availabilityId, index) => {
      const reservationAvailability = new ReservationAvailability({
        reservation,
        availability_id: availabilityId,
        slot_order: index,
      });
      reservation.availabilities.add(reservationAvailability);
      em.persist(reservationAvailability);
    });

    em.persist(reservation);
    await em.flush();

    // Populate relations for DTO conversion
    await em.populate(reservation, ['travellers', 'availabilities']);

    return reservation.toDto();
  }


  async findAll(
    filterDto: GetReservationsFilterDto,
  ): Promise<ReservationDto[]> {
    const { tour_id, date } = filterDto;
    // 1. Initialize an empty filter object
    const where: any = {};

    // 2. Only add to the filter if the value exists
    if (tour_id) {
      where.tour_id = tour_id;
    }

    if (date) {
      /**
       * `date` is expected to be a calendar date string: "YYYY-MM-DD".
       * We convert it into an explicit UTC day range so that reservations
       * like "2026-01-23T06:00:00.000Z" are correctly included.
       */
      const startOfDay = dayjs.utc(date).startOf('day').toDate();
      const endOfDay = dayjs.utc(date).endOf('day').toDate();

      where.datetime = { $gte: startOfDay, $lte: endOfDay };
    }

    // 3. Pass the dynamic object to MikroORM
    const reservations = await this.reservationRepository.find(where, {
      populate: ['travellers', 'availabilities'],
    });

    return reservations.map((reservation) => reservation.toDto());
  }

  findOne(id: string): Promise<ReservationDto> {
    // TODO: Implement find one reservation
    throw new Error('Not implemented');
  }

  update(
    id: string,
    updateReservationDto: UpdateReservationDto,
  ): Promise<ReservationDto> {
    // TODO: Implement update reservation
    throw new Error('Not implemented');
  }

  remove(id: string): Promise<void> {
    // TODO: Implement remove reservation
    throw new Error('Not implemented');
  }
}
