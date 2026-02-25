import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class RabbitmqController {
  private readonly logger = new Logger(RabbitmqController.name);

  @EventPattern('tour.review_requested')
  handleReviewRequested(
    @Payload() data: { tour_id: string },
    @Ctx() context: RmqContext,
  ) {
    this.logger.log(`Received review request for tour: ${data.tour_id}`);
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);
  }
}
