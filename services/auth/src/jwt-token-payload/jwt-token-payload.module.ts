import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { JwtTokenPayloadService } from './jwt-token-payload.service';

@Module({
  imports: [HttpModule],
  providers: [JwtTokenPayloadService],
  exports: [JwtTokenPayloadService],
})
export class JwtTokenPayloadModule {}
