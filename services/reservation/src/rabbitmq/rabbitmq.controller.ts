import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class RabbitmqController {
  private readonly logger = new Logger(RabbitmqController.name);

  @EventPattern('reservation.confirm_requested')
  handleConfirmRequested(
    @Payload() data: { reservation_id: string },
    @Ctx() context: RmqContext,
  ) {
    this.logger.log(
      `Received confirm request for reservation: ${data.reservation_id}`,
    );
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);
  }
}
