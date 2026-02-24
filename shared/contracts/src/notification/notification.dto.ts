import { z } from 'zod';

/**
 * Delivery channels supported by the Go notification service.
 *
 * - `push`  — In-app real-time notification via WebSocket (`/ws?userId=`).
 *             Always available; no external provider needed.
 *             The frontend receives: `{ type: 'notification', template, subject, data }`.
 *
 * - `email` — Delivered via SMTP / SendGrid / Mailgun.
 *             Requires the Go service to have SMTP_* or SENDGRID_API_KEY env vars set.
 *             `subject` becomes the email subject line; `template` selects the HTML template;
 *             `data` is injected into the template.
 *
 * - `sms`   — Delivered via Twilio (or another SMS provider).
 *             Requires TWILIO_* env vars in the Go service.
 *             `subject` is used as the SMS text (keep it short); `data` can add dynamic values.
 *
 * You can fan out to multiple channels in a single message, e.g. `['email', 'push']`.
 */
export const notificationChannelSchema = z.enum(['email', 'sms', 'push']);

/**
 * Message published to the `notifications` RabbitMQ queue.
 * Consumed by the Go notification service (`services/notification`).
 *
 * Fields:
 *
 * - `user_id`  — Target user's ID (UUID or Better-auth sub).
 *                Used by the Go service to look up the user's email/phone
 *                and to route WebSocket push to the correct connected client.
 *
 * - `channels` — One or more delivery channels (see `NotificationChannel`).
 *                Currently emit only `['push']` until email/SMS providers are configured.
 *                Switch to `['email', 'push']` once SMTP or SendGrid is wired up in the Go service.
 *
 * - `template` — Key that selects a pre-defined message template in the Go service
 *                (e.g. `'reservation_created'`). Drives the body content for email/SMS/push.
 *                Add new template keys to the Go handler as needed.
 *
 * - `subject`  — Short human-readable title.
 *                Email: subject line. SMS: message text (keep ≤160 chars). Push: notification title.
 *
 * - `data`     — Optional arbitrary payload forwarded to the template engine and/or
 *                to the frontend via WebSocket. Include IDs and display values the
 *                frontend or template needs to render the notification correctly.
 *
 * @example
 * // Emit after a reservation is created (push only for now):
 * rabbitmq.emit(NOTIFICATION_EVENTS.RESERVATION_CREATED, {
 *   user_id: travellerId,
 *   channels: ['push'],
 *   template: 'reservation_created',
 *   subject: 'Reservation Created',
 *   data: { reservation_id, tour_id, datetime },
 * });
 *
 * // Once email is configured, switch to:
 * channels: ['email', 'push'],
 */
export const notificationMessageSchema = z.object({
  user_id: z.string(),
  channels: z.array(notificationChannelSchema).min(1),
  template: z.string(),
  subject: z.string(),
  data: z.record(z.string(), z.unknown()).optional(),
});

export type NotificationChannel = z.infer<typeof notificationChannelSchema>;
export type NotificationMessageDto = z.infer<typeof notificationMessageSchema>;
