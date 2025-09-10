import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Category } from './entities/category.entity';
import { jwtConfig } from '../config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MikroOrmModule.forFeature([Category]),
    JwtModule.registerAsync(jwtConfig.asProvider())
  ],
  controllers: [CategoryController],
  providers: [CategoryService]
})
export class CategoryModule {}
