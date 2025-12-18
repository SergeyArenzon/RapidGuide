import {
  AfterCreate,
  AfterDelete,
  AfterUpdate,
  Entity,
  Property,
  Collection,
  OneToMany,
} from '@mikro-orm/core';
import { BaseEntity } from '../entities/base.entity';
import { TourTimeSlot } from '../tour-time-slot/entities/tour-time-slot.entity';
import { TourSubcategory } from '../tour-subcategory/entities/tour-subcategory.entity';

@Entity()
export class Tour extends BaseEntity {
  constructor(tour: Partial<Tour>) {
    super();
    this.assign(tour as Partial<this>);
  }

  @AfterCreate()
  logCreate() {
    console.log('Created new tour with id', this.id);
  }

  @AfterUpdate()
  logUpdater() {
    console.log('Updated tour with id', this.id);
  }

  @AfterDelete()
  logDelete() {
    console.log('Deleted tour with id', this.id);
  }

  /**
   * Guide's user_id who created this tour
   */
  @Property({ type: 'uuid' })
  guide_id: string;

  /**
   * Tour title/name
   */
  @Property({ nullable: false })
  name: string;

  /**
   * Tour description
   */
  @Property({ type: 'text' })
  description: string;

  /**
   * Whether this tour can be booked as a private tour
   */
  @Property({ default: false })
  is_private_available: boolean;

  /**
   * Minimum number of travellers required for group booking
   */
  @Property({ nullable: true })
  min_travellers?: number;

  /**
   * Maximum number of travellers allowed for group booking
   */
  @Property({ nullable: true })
  max_travellers?: number;

  /**
   * Price per person for the tour
   */
  @Property({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  /**
   * Price per person for private tour
   */
  @Property({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  private_price?: number;

  /**
   * Price per person for group tour
   */
  @Property({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  group_price?: number;

  /**
   * Duration of the tour in minutes
   */
  @Property({ nullable: true })
  duration_minutes?: number;

  /**
   * Subcategories associated with this tour
   */
  @OneToMany(() => TourSubcategory, (tourSubcategory) => tourSubcategory.tour)
  tourSubcategories = new Collection<TourSubcategory>(this);

  /**
   * Time slots available for this tour
   */
  @OneToMany(() => TourTimeSlot, (timeSlot) => timeSlot.tour)
  timeSlots = new Collection<TourTimeSlot>(this);

  /**
   * Bookings for this tour (pending, approved, rejected, cancelled)
   */
  //   @OneToMany(() => Booking, (booking) => booking.tour)
  //   bookings = new Collection<Booking>(this);
}
