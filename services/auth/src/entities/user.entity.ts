import { Entity, type Opt, Property, Unique } from '@mikro-orm/postgresql';
import type { User as UserSchema } from 'better-auth';

import { RecordSoft } from './recordSoft';

export type UserBase = Omit<UserSchema, 'name'>;

export type UserInput = Pick<UserBase, 'email'>;

@Entity()
export class User extends RecordSoft implements UserBase {
  /**
   * User email address
   */
  @Property<User>({ type: 'string' })
  @Unique()
  email!: string;

  @Property<User>({ type: 'boolean', default: false, nullable: false })
  emailVerified: Opt<boolean> = false;

  @Property<User>({ type: 'string' })
  readonly name: Opt<string> = '';

  @Property<User>({ type: 'string' })
  readonly image: Opt<string> = '';
}
