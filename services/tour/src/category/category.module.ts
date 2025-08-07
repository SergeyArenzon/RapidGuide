import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Category } from './entities/category.entity';
import { SubCategory } from '../sub-category/entities/sub-category';

@Module({
  imports: [MikroOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
