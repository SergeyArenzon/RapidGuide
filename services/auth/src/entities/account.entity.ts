import { Entity, ManyToOne, type Opt, Property } from '@mikro-orm/postgresql';
import { Record } from './record';
import { User } from './user.entity';

@Entity()
export class Account extends Record {
  /**
   * The id of the account as provided by the SSO or equal to userId for credential accounts
   */
  @Property<Account>({ type: 'string' })
  accountId!: string;

  /**
   * The id of the provider
   */
  @Property<Account>({ type: 'string' })
  providerId!: string;

  /**
   * The access token of the account.
   * Returned by the provider
   */
  @Property<Account>({
    type: 'string',
    columnType: 'text',
    nullable: true,
    default: null,
  })
  accessToken?: Opt<string>;

  /**
   * The refresh token of the account.
   * Returned by the provider
   */
  @Property<Account>({
    type: 'string',
    columnType: 'text',
    nullable: true,
    default: null,
  })
  refreshToken?: Opt<string>;

  /**
   * The id token of the account.
   * Returned by the provider
   */
  @Property<Account>({
    type: 'string',
    columnType: 'text',
    nullable: true,
    default: null,
  })
  idToken?: Opt<string>;

  /**
   * The time when the verification request expires
   */
  @Property<Account>({ type: 'datetime', nullable: true, default: null })
  accessTokenExpiresAt?: Opt<Date>;

  /**
   * The time when the verification request expires
   */
  @Property<Account>({ type: 'datetime', nullable: true, default: null })
  refreshTokenExpiresAt?: Opt<Date>;

  /**
   * The scope of the account. Returned by the provider
   */
  @Property<Account>({
    type: 'string',
    columnType: 'text',
    nullable: true,
    default: null,
  })
  scope?: Opt<string>;

  /**
   * The password of the account.
   * Mainly used for email and password authentication
   */
  @Property<Account>({
    type: 'string',
    columnType: 'text',
    nullable: true,
    default: null,
  })
  password?: Opt<string>;

  /**
   * User associated with the account
   */
  @ManyToOne(() => User, { eager: true })
  user!: User;
}
