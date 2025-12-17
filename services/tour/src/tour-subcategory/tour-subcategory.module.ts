import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TourSubcategoryService } from './tour-subcategory.service';
import { TourSubcategoryController } from './tour-subcategory.controller';
import { TourSubcategory } from './entities/tour-subcategory.entity';

@Module({
  imports: [MikroOrmModule.forFeature([TourSubcategory])],
  controllers: [TourSubcategoryController],
  providers: [TourSubcategoryService],
})
export class TourSubcategoryModule {}
