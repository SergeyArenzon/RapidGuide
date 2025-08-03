import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/config';
import { User } from 'src/entities';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig.asProvider()),
    MikroOrmModule.forFeature([User]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
