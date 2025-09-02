import { Module } from '@nestjs/common';
import { GuideController } from './guide.controller';
import { GuideService } from './guide.service';
import { Guide } from './entities/guide.entity';
import { GuideSubcategory } from './entities/guide-subcategory.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { JwtModule } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

@Module({
  imports: [
    MikroOrmModule.forFeature([Guide, GuideSubcategory]),
    JwtModule,
  ],
  controllers: [GuideController],
  providers: [GuideService, Reflector],
  exports: [GuideService],
})
export class GuideModule {}
