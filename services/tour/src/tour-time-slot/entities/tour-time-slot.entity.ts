import { Entity, Property, ManyToOne } from '@mikro-orm/core';
import { BaseEntity } from '../../entities/base.entity';
import { Tour } from '../../tour/tour.entity';

/**
 * Represents a time slot when a tour is available
 */
@Entity()
export class TourTimeSlot extends BaseEntity {
  constructor(timeSlot: Partial<TourTimeSlot>) {
    super();
    this.assign(timeSlot as Partial<this>);
  }

  @ManyToOne(() => Tour, { deleteRule: 'cascade' })
  tour!: Tour;

  /**
   * Start time of the time slot
   */
  @Property({ type: 'datetime' })
  start_time: Date;

  /**
   * End time of the time slot
   */
  @Property({ type: 'datetime' })
  end_time: Date;

  /**
   * Whether this time slot is available for booking
   * Each time slot can only have one approved booking (private or group)
   * Multiple pending bookings are allowed until guide approves one
   */
  @Property({ default: true })
  is_available: boolean;

  /**
   * Bookings for this time slot (can have multiple pending, but only one approved)
   */
  // @OneToMany(() => Booking, (booking) => booking.time_slot)
  // bookings = new Collection<Booking>(this);
}
