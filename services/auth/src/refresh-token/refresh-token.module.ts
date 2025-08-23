import { Module } from '@nestjs/common';
import { RefreshTokenService } from './refresh-token.service';
import { RedisModule } from '@rapid-guide-io/redis';

@Module({
  imports: [RedisModule],
  providers: [RefreshTokenService],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}
