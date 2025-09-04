import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import microOrmConfig from './mikro-orm.config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CategoryModule } from './category/category.module';
import { SubCategoryModule } from './sub-category/sub-category.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(microOrmConfig),
    CategoryModule,
    SubCategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
