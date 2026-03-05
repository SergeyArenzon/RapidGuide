import { Module } from '@nestjs/common';
import { UserController } from './profile.controller';
import { UserService } from './profile.service';
import { GuideModule } from '../guide/guide.module';
import { TravellerModule } from 'src/traveller/traveller.module';

@Module({
  imports: [GuideModule, TravellerModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
