import { Entity, ManyToOne } from '@mikro-orm/core';
import { BaseEntity } from '../../entities/base.entity';
import { Tour } from '../../tour/tour.entity';
import { SubCategory } from '../../sub-category/entities/sub-category';

/**
 * Join entity for Tour and SubCategory many-to-many relationship
 */
@Entity()
export class TourSubcategory extends BaseEntity {
  constructor(tourSubcategory: Partial<TourSubcategory>) {
    super();
    this.assign(tourSubcategory as Partial<this>);
  }

  @ManyToOne(() => Tour, { deleteRule: 'cascade' })
  tour!: Tour;

  @ManyToOne(() => SubCategory, { deleteRule: 'cascade' })
  subcategory!: SubCategory;
}
