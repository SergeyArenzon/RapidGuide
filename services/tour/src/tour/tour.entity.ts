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
import { TourSubcategory } from '../tour-subcategory/entities/tour-subcategory.entity';
import { TourDto } from '@rapid-guide-io/contracts';

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
   * City ID where the tour takes place (references profile service)
   */
  @Property({ type: 'decimal', nullable: false })
  city_id: number;

  /**
   * Country code where the tour takes place (references profile service)
   */
  @Property({ type: 'text', nullable: false })
  country_code: string;

  /**
   * Bookings for this tour (pending, approved, rejected, cancelled)
   */
  //   @OneToMany(() => Booking, (booking) => booking.tour)
  //   bookings = new Collection<Booking>(this);

  toDto(): TourDto {
    return {
      id: this.id,
      guide_id: this.guide_id,
      name: this.name,
      description: this.description,
      min_travellers: this.min_travellers,
      max_travellers: this.max_travellers,
      price: this.price,
      duration_minutes: this.duration_minutes,
      subcategory_ids: this.tourSubcategories
        ? this.tourSubcategories.getItems().map((tsc) => tsc.subcategory.id)
        : [],
      city_id: this.city_id,
      country_code: this.country_code,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}
