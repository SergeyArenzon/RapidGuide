import {
  AfterCreate,
  AfterDelete,
  AfterUpdate,
  Entity,
  Property,
  ManyToOne,
} from '@mikro-orm/core';
import { Guide } from './guide.entity';
import { BaseEntity } from 'src/entities/base.entity';

@Entity()
export class GuideSubcategory extends BaseEntity {
  constructor(guide: Partial<GuideSubcategory>) {
    super();
    Object.assign(this, guide);
  }

  @AfterCreate()
  logCreate() {
    console.log('Created new guide subcategory');
  }

  @AfterUpdate()
  logUpdater() {
    console.log('Updated guide subcategory');
  }

  @AfterDelete()
  logDelete() {
    console.log('Deleted guide subcategory');
  }

  @ManyToOne(() => Guide, { deleteRule: 'cascade' }) // 🔗 FK to guides
  guide!: Guide;

  @Property()
  subcategory_id!: string; // foreign ID from tour service
}
