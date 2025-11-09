import { Entity, Property } from '@mikro-orm/postgresql';

import { Record } from './record';

@Entity()
export class Verification extends Record {
  /**
   * Unique identifier for each verification
   */
  @Property<Verification>({ type: 'string' })
  identifier!: string;

  /**
   * The value to be verified
   */
  @Property<Verification>({ type: 'string', columnType: 'text' })
  value!: string;

  /**
   * The time when the verification request expires
   */
  @Property<Verification>({ type: 'datetime' })
  expiresAt!: Date;
}
