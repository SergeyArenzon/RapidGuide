# Notification Service — Design

## Overview

The notification service is a **Go** service that:

1. **Consumes** notification events from **RabbitMQ** (other services publish “send notification” messages).
2. **Delivers** via multiple channels: **email**, **SMS**, and **in-app** (real-time).
3. **Pushes in-app notifications** to the frontend over **WebSocket**, keyed by user ID.

## Architecture

```
┌─────────────────┐     publish      ┌──────────────┐     consume      ┌─────────────────────┐
│  Other services │ ───────────────► │   RabbitMQ   │ ◄─────────────── │  Notification Svc   │
│  (auth, tour,   │   notification  │  (queue:     │   AMQP consumer  │                     │
│   reservation)  │   events        │   notifications)                 │  ┌───────────────┐   │
└─────────────────┘                 └──────────────┘                  │  │ Message       │   │
                                                                       │  │ handler       │   │
                                                                       │  └───────┬───────┘   │
                                                                       │          │          │
        ┌──────────────────────────────────────────────────────────────┼──────────┼──────────┤
        │                                                              │          ▼          │
        │                                              ┌───────────────┴──────────────────┐ │
        │                                              │  Channel dispatch                  │ │
        │                                              │  • email  → EmailSender           │ │
        │                                              │  • sms    → SMSSender            │ │
        │                                              │  • push   → WebSocket hub        │ │
        │                                              └──────────────────────────────────┘ │
        │                                                              │                     │
        │  WebSocket (wss://...)                                       │  Gin HTTP          │
        └─────────────────────────────────────────────────────────────┼─────────────────────┘
                                                                       │  /ws?userId=...     │
                                                                       │  /health            │
                                                                       └─────────────────────┘
                                                                                    │
                                                                                    ▼
                                                                       ┌─────────────────────┐
                                                                       │  Frontend (client)   │
                                                                       │  Real-time toasts    │
                                                                       └─────────────────────┘
```

## Message Contract (RabbitMQ)

Other services publish JSON messages to a **notifications** queue (or to an exchange bound to it). Suggested payload:

```json
{
  "user_id": "uuid-or-sub",
  "channels": ["email", "sms", "push"],
  "template": "booking_confirmed",
  "subject": "Booking confirmed",
  "data": {
    "tour_name": "...",
    "date": "..."
  }
}
```

- **user_id**: Target user (for email/SMS lookup and for WebSocket routing).
- **channels**: Which channels to use: `email`, `sms`, `push` (in-app via WebSocket).
- **template**: Optional template key for i18n or predefined content.
- **subject**: Optional (email subject, SMS first line, push title).
- **data**: Arbitrary payload for templates and for the frontend.

The notification service **listens** on a single queue (e.g. `notifications`) and dispatches per channel.

## Components

| Component        | Responsibility |
|-----------------|----------------|
| **Config**      | AMQP URL, queue name, HTTP port, optional email/SMS provider settings. |
| **RabbitMQ**    | Connect, declare queue, consume messages, ack/nack. |
| **Notifier**    | Interfaces: `EmailSender`, `SMSSender`. Implementations: SMTP, SendGrid, Twilio, etc. |
| **WS Hub**      | Register WebSocket connections by `user_id`; broadcast “push” notifications to that user’s connections. |
| **Handler**     | Parse incoming AMQP body → dispatch to email, SMS, and/or WS hub. |
| **HTTP**        | Gin: `/health`, `/ws` (upgrade; optionally require JWT and set `user_id` from token). |

## WebSocket

- **Endpoint**: `GET /ws`. Client can pass `userId` (e.g. from JWT after login) so the server can associate the connection with a user.
- **Protocol**: JSON messages from server to client, e.g. `{"type":"notification","payload":{...}}`.
- **Auth**: In production, validate JWT on upgrade and derive `user_id` from it instead of trusting query params.

## Delivery Channels

- **Email**: Interface + SMTP (or SendGrid/Mailgun) implementation; can be no-op in dev.
- **SMS**: Interface + Twilio (or other) implementation; can be no-op in dev.
- **Push (in-app)**: No external provider; handler writes to the WS hub for the given `user_id`.

## Configuration (env)

- `AMQP_URL` — RabbitMQ connection string (e.g. `amqp://guest:guest@rabbitmq:5672/`).
- `NOTIFICATION_QUEUE` — Queue name (e.g. `notifications`).
- `HTTP_PORT` — Server port (default `8080`).
- Optional: `SMTP_*`, `SENDGRID_API_KEY`, `TWILIO_*`, etc. for providers.

## Summary

- **One** service: consumes from RabbitMQ, sends email/SMS, and serves WebSocket for in-app notifications.
- **Single queue** for all notification events; handler branches on `channels` and `user_id`.
- **Extensible**: add new channels (e.g. push to mobile) by new interfaces and handler branches.
