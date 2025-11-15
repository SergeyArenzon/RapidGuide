import { Module } from '@nestjs/common';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { MikroORM } from '@mikro-orm/core';

import { createAuth } from './create-auth.config';
import { PermissionModule } from '../permission/permission.module';
import { PermissionService } from '../permission/permission.service';

@Module({
  imports: [
    PermissionModule,
    AuthModule.forRootAsync({
      imports: [PermissionModule],
      inject: [MikroORM, PermissionService],
      useFactory: (orm: MikroORM, permissionService: PermissionService) => {
        return {
          auth: createAuth(orm, permissionService),
        };
      },
    }),
  ],
  exports: [AuthModule],
})
export class BetterAuthModule {}
