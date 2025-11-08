import { PrimaryKey } from '@mikro-orm/postgresql';
import { v7 as uuidV7 } from 'uuid';

/**
 * Represents base abstract database entity
 */
export abstract class Node {
  @PrimaryKey({ type: 'uuid' })
  readonly id: string = uuidV7();
}
