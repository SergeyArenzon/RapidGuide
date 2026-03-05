import {
  AfterCreate,
  AfterDelete,
  AfterUpdate,
  Entity,
  Property,
  ManyToOne,
} from '@mikro-orm/core';
import { Traveller } from './traveller.entity';
import { BaseEntity } from '../../entities/base.entity';

@Entity()
export class TravellerSubcategory extends BaseEntity {
  constructor(traveller: Partial<TravellerSubcategory>) {
    super();
    Object.assign(this, traveller);
  }

  @AfterCreate()
  logCreate() {
    console.log('Created new traveller subcategory');
  }

  @AfterUpdate()
  logUpdater() {
    console.log('Updated traveller subcategory');
  }

  @AfterDelete()
  logDelete() {
    console.log('Deleted traveller subcategory');
  }

  @ManyToOne(() => Traveller, { deleteRule: 'cascade' }) // 🔗 FK to travellers
  traveller!: Traveller;

  @Property({type: "uuid"})
  subcategory_id!: string; // foreign ID from tour service
}

