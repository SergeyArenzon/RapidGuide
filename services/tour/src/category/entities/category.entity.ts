import {
  AfterCreate,
  AfterDelete,
  AfterUpdate,
  Entity,
  Property,
} from '@mikro-orm/core';
import { BaseEntity } from '../../entities/base.entity';
import { CategoryDto } from '@rapid-guide-io/dto';

@Entity()
export class Category extends BaseEntity {
  constructor(category: Partial<Category>) {
    super();
    Object.assign(this, category);
  }

  @AfterCreate()
  logCreate() {
    console.log('Created new category with id', this.id);
  }

  @AfterUpdate()
  logUpdater() {
    console.log('Updated category with id', this.id);
  }

  @AfterDelete()
  logDelete() {
    console.log('Deleted category with id', this.id);
  }

  @Property({ nullable: false })
  name: string;

  @Property()
  description: string;

  toDto(): CategoryDto {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}
