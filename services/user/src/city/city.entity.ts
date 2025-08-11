import {
  AfterCreate,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { DateEntity } from '../entities/date.entity';
import { Country } from '../country/country.entity';
import { CityDto } from '@rapid-guide-io/shared';

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

  @ManyToOne(() => Country, { nullable: false, fieldName: 'code' })
  country!: Country;

  toDto(): CityDto {
    return {
      id: this.id,
      name: this.name,
      country_code: this.country.code,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}
