import {
  AfterCreate,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { DateEntity } from 'src/entities/date.entity';
import { Country } from '../country/country.entity';

@Entity()
export class City extends DateEntity {
  constructor(city: Partial<City>) {
    super();
    Object.assign(this, city);
  }

  @AfterCreate()
  logCreate() {
    console.log('Created new city with code', this.name);
  }

  @PrimaryKey()
  id!: number;

  @Property({ type: 'text' })
  name!: string;

  @ManyToOne(() => Country, { nullable: false, fieldName: 'country_code' })
  country!: Country;
}
