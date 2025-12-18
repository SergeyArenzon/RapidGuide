import { Entity, Property, OneToMany, Collection } from '@mikro-orm/core';
import { BaseEntity } from '../../entities/base.entity';
import { BookingTraveller } from './booking-traveller.entity';

/**
 * Represents a booking made by a traveller for a tour
 * Bookings start as 'pending' and require guide approval
 */
@Entity()
export class Booking extends BaseEntity {
  constructor(booking: Partial<Booking>) {
    super();
    this.assign(booking as Partial<this>);
  }

  /**
   * ID of the tour this booking belongs to (owned by tour service)
   */
  @Property({ type: 'uuid' })
  tour_id: string;

  /**
   * ID of the tour time slot for this booking (owned by tour service)
   */
  @Property({ type: 'uuid' })
  time_slot_id: string;

  /**
   * Number of travellers in this booking (denormalized for performance)
   * Should always match the count of travellers in the travellers collection
   * Use syncTravellerCount() to keep this in sync
   */
  @Property({ default: 1 })
  number_of_travellers: number;

  /**
   * Price per traveller (snapshot from Tour.price at booking time)
   * All travellers in a booking pay the same price
   */
  @Property({ type: 'decimal', precision: 10, scale: 2 })
  price_per_traveller: number;

  /**
   * Total price for this booking (price_per_traveller * number_of_travellers)
   */
  @Property({ type: 'decimal', precision: 10, scale: 2 })
  total_price: number;

  /**
   * Booking status:
   * - pending: Waiting for guide approval
   * - approved: Guide approved, booking confirmed
   * - rejected: Guide rejected this booking
   * - cancelled: Booking was cancelled (by traveller or guide)
   */
  @Property({ default: 'pending' })
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';

  /**
   * Booking request date/time
   */
  @Property({ type: 'datetime' })
  booking_date: Date;

  /**
   * When the guide approved/rejected this booking
   */
  @Property({ type: 'datetime', nullable: true })
  reviewed_at?: Date;

  /**
   * All travellers in this booking
   */
  @OneToMany(() => BookingTraveller, (traveller) => traveller.booking)
  travellers = new Collection<BookingTraveller>(this);
}
