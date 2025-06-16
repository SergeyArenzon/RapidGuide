import { PrimaryKey } from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';
import { DateEntity } from './date.entity';

// Generic BaseEntity with utility methods
export abstract class BaseEntity extends DateEntity {
  @PrimaryKey()
  id: string = uuid();

  // Utility method for property assignment
  assign(data: Partial<this>) {
    Object.assign(this, data);
  }

  // Utility method for serialization
  toJSON() {
    const obj = { ...this };
    return obj;
  }
}
