import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NotificationMessageDto } from '@rapid-guide-io/contracts';

@Injectable()
export class RabbitmqPublisherService implements OnModuleInit {
  private readonly logger = new Logger(RabbitmqPublisherService.name);

  constructor(
    @Inject('NOTIFICATION_SERVICE') private readonly client: ClientProxy,
  ) {}

  async onModuleInit() {
    await this.client.connect();
  }

  emit(event: string, message: NotificationMessageDto): void {
    this.logger.log(`Emitting event: ${event} for user: ${message.user_id}`);
    this.client.emit(event, message);
  }
}
