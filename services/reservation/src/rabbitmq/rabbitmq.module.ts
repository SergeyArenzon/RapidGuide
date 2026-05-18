import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { QUEUE_NAMES } from '@rapid-guide-io/contracts';
import { RabbitmqPublisherService } from './rabbitmq-publisher.service';
import { RabbitmqController } from './rabbitmq.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'NOTIFICATION_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL],
          queue: process.env.NOTIFICATION_QUEUE ?? QUEUE_NAMES.NOTIFICATIONS,
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  controllers: [RabbitmqController],
  providers: [RabbitmqPublisherService],
  exports: [RabbitmqPublisherService],
})
export class RabbitmqModule {}
