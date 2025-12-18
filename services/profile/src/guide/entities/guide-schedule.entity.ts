import { Entity, Property, ManyToOne } from '@mikro-orm/core';
import { BaseEntity } from '../../entities/base.entity';
import { Guide } from './guide.entity';

/**
 * Represents a guide's availability schedule
 * Supports split shifts and multiple time blocks per day
 * Example: Sunday 12:00-15:00, Sunday 20:00-23:59, Monday 08:00-21:00
 */
@Entity()
export class GuideSchedule extends BaseEntity {
  constructor(schedule: Partial<GuideSchedule>) {
    super();
    this.assign(schedule as Partial<this>);
  }

  /**
   * The guide this schedule belongs to
   */
  @ManyToOne(() => Guide, { deleteRule: 'cascade' })
  guide!: Guide;

  /**
   * Day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
   */
  @Property({ type: 'smallint' })
  day_of_week: number;

  /**
   * Start time of availability (format: "HH:mm:ss" or "HH:mm")
   * Example: "12:00:00" or "08:00"
   */
  @Property({ type: 'time' })
  start_time: string;

  /**
   * End time of availability (format: "HH:mm:ss" or "HH:mm")
   * Example: "15:00:00" or "23:59:00"
   */
  @Property({ type: 'time' })
  end_time: string;
}

