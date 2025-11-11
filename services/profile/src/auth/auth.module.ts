import { Module } from '@nestjs/common';
import { AuthTokenVerifier } from './auth-token-verifier.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  providers: [AuthTokenVerifier, JwtAuthGuard],
  exports: [AuthTokenVerifier, JwtAuthGuard],
})
export class AuthModule {}

