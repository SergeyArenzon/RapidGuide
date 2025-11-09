import { Index, type Opt, Property } from '@mikro-orm/postgresql';
import { Record } from './record';

/**
 * Represents soft-removable database entity
 */
export abstract class RecordSoft extends Record {
  /**
   * The date and time the entity have been marked as removed
   */
  @Property<RecordSoft>({ type: 'string', nullable: true, default: null })
  @Index()
  removedAt: Opt<Date> = null;
}
