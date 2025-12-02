import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { JwtTokenPayloadService } from './jwt-token-payload.service';
import { ScopeModule } from 'src/scope/scope.module';

@Module({
  imports: [HttpModule, ScopeModule],
  providers: [JwtTokenPayloadService],
  exports: [JwtTokenPayloadService],
})
export class JwtTokenPayloadModule {}
