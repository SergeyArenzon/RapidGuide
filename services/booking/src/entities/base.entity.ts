import { PrimaryKey, Property } from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';

// Generic BaseEntity with utility methods
export abstract class BaseEntity {
  @PrimaryKey()
  id: string = uuid();

  @Property({ onCreate: () => new Date() })
  created_at: Date;

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  updated_at: Date;

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
