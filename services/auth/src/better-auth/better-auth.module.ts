import { Module } from '@nestjs/common';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { MikroORM } from '@mikro-orm/core';
import { HttpModule, HttpService } from '@nestjs/axios';

import { createAuth } from './create-auth.config';

@Module({
  imports: [
    HttpModule,
    AuthModule.forRootAsync({
      imports: [HttpModule],
      inject: [MikroORM, HttpService],
      useFactory: (orm: MikroORM, httpService: HttpService) => ({
        auth: createAuth(orm, httpService),
      }),
    }),
  ],
  exports: [AuthModule],
})
export class BetterAuthModule {}
