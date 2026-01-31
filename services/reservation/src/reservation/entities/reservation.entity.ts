import {
  Entity,
  Property,
  OneToMany,
  Collection,
  BeforeCreate,
  BeforeUpdate,
  AfterUpdate,
} from '@mikro-orm/core';
import { BaseEntity } from '../../entities/base.entity';
import { ReservationTraveller } from './reservation-traveller.entity';
import { ReservationAvailability } from './reservation-availability.entity';
import { ReservationDto } from '@rapid-guide-io/contracts';

/**
 * Represents a tour reservation made by a traveller
 *
 * A reservation is a request to book a tour at a specific date/time.
 * It starts as 'pending' and requires guide confirmation to be confirmed.
 * Once confirmed, it becomes a confirmed booking.
 *
 * Key characteristics:
 * - Can hold multiple reservant travellers
 * - Status remains 'pending' until guide confirms or rejects it
 * - Stores pricing snapshot from the time of reservation
 */
@Entity()
export class Reservation extends BaseEntity {
  constructor(reservation: Partial<Reservation>) {
    super();
    this.assign(reservation as Partial<this>);
  }

  /**
   * ID of the tour this reservation is for (owned by tour service)
   */
  @Property({ type: 'uuid' })
  tour_id: string;

  /**
   * The scheduled date and time for the tour
   * This is when the tour is expected to start.
   *
   * This is denormalized from the availability's start_date for:
   * - Performance: avoids querying the profile service for reservation details
   * - Data integrity: preserves the original scheduled time even if availability changes
   *
   * Should match the availability's start_date at the time of reservation creation.
   */
  @Property({ type: 'datetime' })
  datetime: Date;

  /**
   * Number of travellers in this reservation (denormalized for performance)
   * Should always match the count of travellers in the travellers collection
   * Use syncTravellerCount() to keep this in sync
   */
  @Property({ default: 1 })
  number_of_travellers: number;

  /**
   * Price per traveller (snapshot from Tour.price at reservation time)
   * All travellers in a reservation pay the same price
   * This is a snapshot to prevent price changes from affecting existing reservations
   */
  @Property({ type: 'decimal', precision: 10, scale: 2 })
  price_per_traveller: number;

  /**
   * Total price for this reservation (price_per_traveller * number_of_travellers)
   */
  @Property({ type: 'decimal', precision: 10, scale: 2 })
  total_price: number;

  /**
   * Reservation status:
   * - pending: Waiting for guide confirmation
   * - confirmed: Guide has confirmed, reservation is now a booking
   * - rejected: Guide rejected this reservation
   * - cancelled: Reservation was cancelled (by traveller or guide)
   */
  @Property({ default: 'pending' })
  status: 'pending' | 'confirmed' | 'rejected' | 'cancelled';

  /**
   * Optional message/notes from the traveller when creating the reservation
   */
  @Property({ type: 'text', nullable: true })
  notes?: string;

  /**
   * When the guide confirmed/rejected this reservation
   */
  @Property({ type: 'datetime', nullable: true })
  reviewed_at?: Date;

  /**
   * Optional rejection reason if the reservation was rejected
   */
  @Property({ type: 'text', nullable: true })
  rejection_reason?: string;

  /**
   * All travellers in this reservation
   * Multiple travellers can be part of one reservation, allowing for group bookings.
   */
  @OneToMany(() => ReservationTraveller, (traveller) => traveller.reservation)
  travellers = new Collection<ReservationTraveller>(this);

  /**
   * All guide availability slots used by this reservation
   *
   * When a tour spans multiple availability slots (e.g., 61-minute tour
   * spanning 09:00-10:00 and 10:00-11:00), this collection tracks all
   * the availability slots that are reserved.
   *
   * For single-slot tours, this will contain one entry matching availability_id.
   * For multi-slot tours, this will contain multiple entries ordered by slot_order.
   */
  @OneToMany(
    () => ReservationAvailability,
    (availability) => availability.reservation,
  )
  availabilities = new Collection<ReservationAvailability>(this);

  /**
   * Synchronize number_of_travellers with the actual count in travellers collection
   * This is automatically called before create/update via lifecycle hooks.
   * You can also call it manually if you modify travellers without persisting.
   */
  countTravellerCount(): void {
    if (this.travellers.isInitialized()) {
      this.number_of_travellers = this.travellers.count();
    }
  }

  /**
   * Calculate and update total_price based on current price_per_traveller and number_of_travellers
   * This is automatically called before create/update via lifecycle hooks.
   */
  calculateTotalPrice(): void {
    this.total_price =
      Number(this.price_per_traveller) * this.number_of_travellers;
  }

  /**
   * Automatically sync traveller count and total price before creating a reservation
   */
  @BeforeCreate()
  beforeCreate() {
    this.countTravellerCount();
    this.calculateTotalPrice();
  }


  @AfterUpdate()
  afterUpdate() {
    this.countTravellerCount();
    this.calculateTotalPrice();
  }

  /**
   * Convert Reservation entity to ReservationDto
   */
  toDto(): ReservationDto {
    return {
      id: this.id,
      tour_id: this.tour_id,
      datetime: this.datetime,
      number_of_travellers: this.number_of_travellers,
      price_per_traveller: Number(this.price_per_traveller),
      total_price: Number(this.total_price),
      status: this.status,
      notes: this.notes || null,
      reviewed_at: this.reviewed_at || null,
      rejection_reason: this.rejection_reason || null,
      traveller_ids: this.travellers.isInitialized()
        ? this.travellers.getItems().map((t) => t.traveller_id)
        : [],
      reservation_availabilities: this.availabilities.isInitialized()
        ? this.availabilities
            .getItems()
            .map((reservationAvailability) => reservationAvailability.toDto())
        : [],
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}
