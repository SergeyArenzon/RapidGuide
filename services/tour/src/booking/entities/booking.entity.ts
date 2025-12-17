import { Entity, Property, ManyToOne } from '@mikro-orm/core';
import { BaseEntity } from '../../entities/base.entity';
import { Tour } from '../../tour/tour.entity';
import { TourTimeSlot } from '../../tour-time-slot/entities/tour-time-slot.entity';

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

  @ManyToOne(() => Tour, { deleteRule: 'cascade' })
  tour!: Tour;

  @ManyToOne(() => TourTimeSlot, { deleteRule: 'cascade' })
  time_slot!: TourTimeSlot;

  /**
   * Traveller's user_id who made this booking
   */
  @Property({ type: 'uuid' })
  traveller_user_id: string;

  /**
   * Whether this is a private tour booking
   */
  @Property({ default: false })
  is_private: boolean;

  /**
   * Number of travellers in this booking
   */
  @Property({ default: 1 })
  number_of_travellers: number;

  /**
   * Total price for this booking
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
}
