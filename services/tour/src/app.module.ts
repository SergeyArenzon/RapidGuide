import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import microOrmConfig from './mikro-orm.config';
import { JwtModule } from '@nestjs/jwt';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CategoryModule } from './category/category.module';
import { SubCategoryModule } from './sub-category/sub-category.module';
import { jwtConfig } from './config';

@Module({
  imports: [
    MikroOrmModule.forRoot(microOrmConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    CategoryModule,
    SubCategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
