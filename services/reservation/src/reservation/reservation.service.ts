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
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
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
    console.log({ createReservationDto });

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

    return this.toDto(reservation);
  }

  /**
   * Convert Reservation entity to ReservationDto
   */
  private toDto(reservation: Reservation): ReservationDto {
    const availabilities = reservation.availabilities.isInitialized()
      ? reservation.availabilities
          .getItems()
          .sort((a, b) => a.slot_order - b.slot_order)
      : [];

    return {
      id: reservation.id,
      tour_id: reservation.tour_id,
      datetime: reservation.datetime,
      number_of_travellers: reservation.number_of_travellers,
      price_per_traveller: Number(reservation.price_per_traveller),
      total_price: Number(reservation.total_price),
      status: reservation.status,
      notes: reservation.notes || null,
      reviewed_at: reservation.reviewed_at || null,
      rejection_reason: reservation.rejection_reason || null,
      traveller_ids: reservation.travellers.isInitialized()
        ? reservation.travellers.getItems().map((t) => t.traveller_id)
        : [],
      availabilities: availabilities.map((a) => ({
        availability_id: a.availability_id,
        slot_order: a.slot_order,
      })),
      created_at: reservation.created_at,
      updated_at: reservation.updated_at,
    };
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

      console.log({startOfDay, endOfDay});
      where.datetime = { $gte: startOfDay, $lte: endOfDay };
    }

    // 3. Pass the dynamic object to MikroORM
    const reservations = await this.reservationRepository.find(where);

    return reservations.map(this.toDto);
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
