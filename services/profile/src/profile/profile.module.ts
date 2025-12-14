import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { GuideModule } from '../guide/guide.module';
import { TravellerModule } from 'src/traveller/traveller.module';

@Module({
  imports: [GuideModule, TravellerModule],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}

