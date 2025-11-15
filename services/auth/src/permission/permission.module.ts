import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PermissionService } from './permission.service';

@Module({
  imports: [HttpModule],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}
