import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import mikroOrmConfig from 'src/mikro-orm.config';
import { BetterAuthModule } from './better-auth';

@Module({
  imports: [
    // MikroORM setup
    MikroOrmModule.forRoot(mikroOrmConfig),
    // Better Auth module
    BetterAuthModule,
    // RedisModule.forRoot({
    //   host: process.env.REDIS_HOST,
    //   port: parseInt(process.env.REDIS_PORT),
    //   password: process.env.REDIS_PASSWORD,
    //   db: parseInt(process.env.REDIS_DB),
    // }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
