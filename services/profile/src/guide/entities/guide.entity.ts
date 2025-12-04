import {
  AfterCreate,
  AfterDelete,
  AfterUpdate,
  Entity,
  ManyToOne,
  Property,
  ManyToMany,
  Collection,
  OneToMany,
} from '@mikro-orm/core';
import { BaseEntity } from '../../entities/base.entity';
// import { User } from '../../user/user.entity';
import { City } from '../../city/city.entity';
import { Country } from '../../country/country.entity';
import { Languages } from '../../languages/languages.entity';
import { GuideSubcategory } from './guide-subcategory.entity';
import { GuideDto } from '@rapid-guide-io/contracts';

@Entity()
export class Guide extends BaseEntity {
  constructor(guide: Partial<Guide>) {
    super();
    Object.assign(this, guide);
  }

  @Property({ type: 'uuid', unique: true })
  user_id: string;

  @Property({ type: 'text' })
  name: string;

  @Property({ type: 'text' })
  bio: string;

  @OneToMany(() => GuideSubcategory, (subcategory) => subcategory.guide)
  subcategories = new Collection<GuideSubcategory>(this);

  @ManyToMany(() => Languages)
  languages = new Collection<Languages>(this);

  @ManyToOne(() => Country)
  country!: Country;

  @ManyToOne(() => City)
  city!: City;

  toDto(): GuideDto {
    return {
      id: this.id,
      user_id: this.user_id,
      name: this.name,
      bio: this.bio,
      country_code: this.country.code,
      city_id: this.city.id,
      languages_code: this.languages.getItems().map((lang) => lang.code),
      subcategories_id: this.subcategories
        .getItems()
        .map((sub) => sub.subcategory_id),
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }

  @AfterCreate()
  logCreate() {
    console.log('Created new guide with id', this.id);
  }

  @AfterUpdate()
  logUpdater() {
    console.log('Updated guide with id', this.id);
  }

  @AfterDelete()
  logDelete() {
    console.log('Deleted guide with id', this.id);
  }
}
