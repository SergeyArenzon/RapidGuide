import { Entity, Property, ManyToOne } from '@mikro-orm/core';
import { BaseEntity } from '../../entities/base.entity';
import { Booking } from './booking.entity';

/**
 * Represents a traveller in a booking
 * Tracks all individual travellers who are part of a booking
 */
@Entity()
export class BookingTraveller extends BaseEntity {
  constructor(traveller: Partial<BookingTraveller>) {
    super();
    this.assign(traveller as Partial<this>);
  }

  /**
   * The booking this traveller belongs to
   */
  @ManyToOne(() => Booking, { deleteRule: 'cascade' })
  booking!: Booking;

  /**
   * User ID of the traveller
   * (references user in user service)
   */
  @Property({ type: 'uuid' })
  user_id: string;

  /**
   * Whether this traveller is the one who made the booking
   * (the booker/payer)
   */
  @Property({ default: false })
  is_booker: boolean;
}

