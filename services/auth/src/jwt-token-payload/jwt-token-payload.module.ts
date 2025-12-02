import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { JwtTokenPayloadService } from './jwt-token-payload.service';
import { ScopeService } from 'src/scope/scope.service';

@Module({
  imports: [HttpModule],
  providers: [JwtTokenPayloadService, ScopeService],
  exports: [JwtTokenPayloadService],
})
export class JwtTokenPayloadModule {}
