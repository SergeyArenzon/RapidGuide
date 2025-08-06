import {
  AfterCreate,
  AfterDelete,
  AfterUpdate,
  Entity,
  ManyToOne,
  Property,
} from '@mikro-orm/core';
import { BaseEntity } from '../../entities/base.entity';
import { Category } from '../../category/entities/category.entity';
import { SubCategoryDto } from '@rapid-guide-io/shared';

@Entity()
export class SubCategory extends BaseEntity {
  constructor(subCategory: Partial<SubCategory>) {
    super();
    this.assign(subCategory as Partial<this>);
  }

  @AfterCreate()
  logCreate() {
    console.log('Created new sub category with id', this.id);
  }

  @AfterUpdate()
  logUpdater() {
    console.log('Updated sub category with id', this.id);
  }

  @AfterDelete()
  logDelete() {
    console.log('Deleted sub category with id', this.id);
  }

  @Property({ nullable: false })
  name: string;

  @Property()
  description: string;

  @ManyToOne(() => Category)
  category: Category;

  toDto(): SubCategoryDto {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      category_id: this.category.id,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}
