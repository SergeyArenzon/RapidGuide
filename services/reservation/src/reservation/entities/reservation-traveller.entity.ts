import { Entity, Property, ManyToOne } from '@mikro-orm/core';
import { BaseEntity } from '../../entities/base.entity';
import { Reservation } from './reservation.entity';

/**
 * Represents a traveller in a reservation
 * 
 * Tracks all individual travellers who are part of a reservation.
 * All travellers in a reservation are equal - there is no distinction
 * between who created it and who was added.
 */
@Entity()
export class ReservationTraveller extends BaseEntity {
  constructor(traveller: Partial<ReservationTraveller>) {
    super();
    this.assign(traveller as Partial<this>);
  }

  /**
   * The reservation this traveller belongs to
   */
  @ManyToOne(() => Reservation, { deleteRule: 'cascade' })
  reservation!: Reservation;

  /**
   * User ID of the traveller
   * References traveller_id in the profile service
   */
  @Property({ type: 'uuid' })
  traveller_id: string;
}
