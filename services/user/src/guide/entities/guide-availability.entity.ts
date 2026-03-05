import { Entity, Property, ManyToOne } from '@mikro-orm/core';
import { BaseEntity } from '../../entities/base.entity';
import { Guide } from './guide.entity';
import { GuideAvailabilityDto } from '@rapid-guide-io/contracts';

/**
 * Represents a guide's available date ranges
 *
 * Guides can define specific date periods when they are available.
 *
 * Examples:
 * - Available from 2024-12-20 to 2024-12-31 (special holiday availability)
 * - Single day availability on 2024-12-25 (start_date = end_date)
 * - Available from 2024-01-10 to 2024-01-15 (temporary availability period)
 *
 * Note: A guide is available on a date if the date falls within any GuideAvailability range.
 */
@Entity()
export class GuideAvailability extends BaseEntity {
  constructor(availability: Partial<GuideAvailability>) {
    super();
    this.assign(availability as Partial<this>);
  }

  /**
   * The guide this availability belongs to
   */
  @ManyToOne(() => Guide, { deleteRule: 'cascade' })
  guide!: Guide;

  /**
   * Start date of the available period (inclusive)
   * Stored as date only (no time component)
   */
  @Property({ type: 'datetime' })
  start_date: Date;

  /**
   * End date of the available period (inclusive)
   * Stored as date only (no time component)
   * For single-day periods, start_date and end_date are the same
   */
  @Property({ type: 'datetime' })
  end_date: Date;

  toDto(): GuideAvailabilityDto {
    return {
      id: this.id,
      start_date: this.start_date,
      end_date: this.end_date,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}
