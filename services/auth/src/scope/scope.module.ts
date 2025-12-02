import { Module } from '@nestjs/common';
import { ScopeService } from './scope.service';

@Module({
  providers: [ScopeService],
  exports: [ScopeService],
})
export class ScopeModule {}
