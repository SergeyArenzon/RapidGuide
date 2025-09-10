import { Module } from '@nestjs/common';
import { SubCategoryService } from './sub-category.service';
import { SubCategoryController } from './sub-category.controller';
import { SubCategory } from './entities/sub-category';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/config';

@Module({
  imports: [
      MikroOrmModule.forFeature([SubCategory]),
      JwtModule.registerAsync(jwtConfig.asProvider())
    ],
  controllers: [SubCategoryController],
  providers: [SubCategoryService],
})
export class SubCategoryModule {}
