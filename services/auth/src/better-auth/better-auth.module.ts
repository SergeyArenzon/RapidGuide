import { Module } from '@nestjs/common';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { MikroORM } from '@mikro-orm/core';

import { createAuth } from './create-auth.config';
import { JwtTokenPayloadModule } from '../jwt-token-payload/jwt-token-payload.module';
import { JwtTokenPayloadService } from '../jwt-token-payload/jwt-token-payload.service';

@Module({
  imports: [
    JwtTokenPayloadModule,
    AuthModule.forRootAsync({
      imports: [JwtTokenPayloadModule],
      inject: [MikroORM, JwtTokenPayloadService],
      useFactory: (
        orm: MikroORM,
        permissionService: JwtTokenPayloadService,
      ) => {
        return {
          auth: createAuth(orm, permissionService),
        };
      },
    }),
  ],
  exports: [AuthModule],
})
export class BetterAuthModule {}
