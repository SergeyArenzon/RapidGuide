import { Entity, Property, ManyToOne } from '@mikro-orm/core';
import { BaseEntity } from '../../entities/base.entity';
import { Reservation } from './reservation.entity';

/**
 * Represents a guide availability used by a reservation
 * 
 * When a tour spans multiple availability slots (e.g., a 61-minute tour 
 * spanning 09:00-10:00 and 10:00-11:00), this entity tracks all the 
 * availability slots that are reserved for this tour.
 * 
 * Example: A 61-minute tour starting at 09:00 would use:
 * - ReservationAvailability #1: availability_id for 09:00-10:00 slot
 * - ReservationAvailability #2: availability_id for 10:00-11:00 slot
 */
@Entity()
export class ReservationAvailability extends BaseEntity {
  constructor(availability: Partial<ReservationAvailability>) {
    super();
    this.assign(availability as Partial<this>);
  }

  /**
   * The reservation this availability belongs to
   */
  @ManyToOne(() => Reservation, { deleteRule: 'cascade' })
  reservation!: Reservation;

  /**
   * ID of the guide availability slot used (owned by profile service)
   * This represents one of potentially multiple availability slots
   * that are required for a tour that spans multiple time slots.
   */
  @Property({ type: 'uuid' })
  availability_id: string;

  /**
   * Order/index of this availability within the reservation
   * Used to determine the sequence when multiple slots are used.
   * Lower values indicate earlier time slots.
   * 
   * Example: For a 61-min tour from 09:00-10:01:
   * - Order 0: availability for 09:00-10:00
   * - Order 1: availability for 10:00-11:00
   */
  @Property({ default: 0 })
  slot_order: number;
}
