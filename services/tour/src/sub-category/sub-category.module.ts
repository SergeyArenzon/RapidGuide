import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { SubCategoryService } from './sub-category.service';
import { SubCategoryController } from './sub-category.controller';
import { SubCategory } from './entities/sub-category';

@Module({
  imports: [MikroOrmModule.forFeature([SubCategory])],
  controllers: [SubCategoryController],
  providers: [SubCategoryService],
})
export class SubCategoryModule {}
