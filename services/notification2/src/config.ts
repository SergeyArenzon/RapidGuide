import { QUEUE_NAMES } from '@rapid-guide-io/contracts'

export const config = {
  httpPort: Number(process.env.HTTP_PORT) || 8080,
  amqpUrl: process.env.AMQP_URL || 'amqp://guest:guest@localhost:5672/',
  queues: {
    notifications: process.env.NOTIFICATION_QUEUE || QUEUE_NAMES.NOTIFICATIONS,
    reservationEvents: process.env.RESERVATION_EVENTS_QUEUE || QUEUE_NAMES.RESERVATION_EVENTS,
  },
} as const
