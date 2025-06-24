import { Property } from '@mikro-orm/core';

export abstract class DateEntity {
  @Property({ onCreate: () => new Date() })
  created_at: Date;

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  updated_at: Date;
}
