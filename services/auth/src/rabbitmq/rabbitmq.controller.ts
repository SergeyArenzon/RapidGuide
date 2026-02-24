import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class RabbitmqController {
  private readonly logger = new Logger(RabbitmqController.name);

  @EventPattern('auth.session_invalidate_requested')
  handleSessionInvalidateRequested(
    @Payload() data: { user_id: string },
    @Ctx() context: RmqContext,
  ) {
    this.logger.log(
      `Received session invalidation request for user: ${data.user_id}`,
    );
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);
  }
}
