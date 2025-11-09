import { Entity, Index, Property, type Opt } from '@mikro-orm/postgresql';
import { Node } from './node';

/**
 * Represents JSON Web Key Set entry stored in the database.
 *
 * Matches the schema required by the Better Auth JWT plugin.
 */
@Entity({ tableName: 'jwks' })
export class Jwks extends Node {
  /**
   * Public key in JWK format.
   */
  @Property<Jwks>({
    type: 'string',
    columnType: 'text',
  })
  publicKey!: string;

  /**
   * Private key in JWK format.
   * Stored encrypted by Better Auth unless explicitly disabled.
   */
  @Property<Jwks>({
    type: 'string',
    columnType: 'text',
  })
  privateKey!: string;

  @Property({ type: 'datetime' })
  readonly createdAt: Opt<Date> = new Date();

  /**
   * Curve metadata when the algorithm requires it (e.g. Ed25519, P-256).
   */
  @Property<Jwks>({
    type: 'string',
    nullable: true,
    default: null,
  })
  @Index()
  crv: Opt<string> = null;
}
