import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { BetterAuthProvider, BETTER_AUTH_TOKEN } from './auth.provider';
import { User } from '../entities/user.entity';
import { Session } from '../entities/session.entity';
import { Account } from '../entities/account.entity';
import { Verification } from '../entities/verification.entity';

@Module({
  imports: [
    // Import entities needed for Better Auth
    MikroOrmModule.forFeature([User, Session, Account, Verification]),
  ],
  providers: [BetterAuthProvider],
  exports: [BETTER_AUTH_TOKEN], // Export so other modules can inject it
})
export class AuthModule {}

