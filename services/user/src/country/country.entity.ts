import { AfterCreate, Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { DateEntity } from '../entities/date.entity';

@Entity()
export class Country extends DateEntity {
  constructor(country: Partial<Country>) {
    super();
    Object.assign(this, country);
  }

  @AfterCreate()
  logCreate() {
    console.log('Created new country with code', this.code);
  }

  @PrimaryKey({ type: 'text', nullable: false })
  code: string;

  @Property({ type: 'text', nullable: false })
  alpha3: string;

  @Property({ type: 'text', nullable: false })
  name: string;

  @Property({ type: 'text', nullable: false })
  country_code: string;

  @Property({ type: 'text', nullable: false })
  region: string;

  @Property({ type: 'text', nullable: false })
  region_code: string;
}
