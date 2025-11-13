import { Module } from '@nestjs/common';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { MikroORM } from '@mikro-orm/core';

import { createAuth } from './create-auth';

@Module({
  imports: [
    AuthModule.forRootAsync({
      inject: [MikroORM],
      useFactory: (orm: MikroORM) => ({
        auth: createAuth(orm),
      }),
    }),
  ],
  exports: [AuthModule],
})
export class BetterAuthModule {}
