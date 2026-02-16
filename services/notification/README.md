# Notification Service

Go service that consumes notification events from **RabbitMQ**, sends **email** and **SMS**, and pushes **in-app notifications** to the frontend over **WebSocket**.

## Design

See [DESIGN.md](./DESIGN.md) for architecture, message contract, and components.

## Quick start

1. **Dependencies** (requires network):
   ```bash
   go mod tidy
   ```

2. **Run RabbitMQ** (e.g. via Docker or your k8s/skaffold setup).

3. **Environment** (optional; defaults work for local dev):
   - `AMQP_URL` — e.g. `amqp://guest:guest@localhost:5672/`
   - `NOTIFICATION_QUEUE` — e.g. `notifications`
   - `HTTP_PORT` — e.g. `8080`

4. **Run the service**:
   ```bash
   go run .
   ```

5. **Test**:
   - Health: `curl http://localhost:8080/health`
   - WebSocket: connect to `ws://localhost:8080/ws?userId=<user-id>` (e.g. from browser or client app).
   - Publish a message to the `notifications` queue (JSON per DESIGN.md); the service will log email/SMS and push to WS for that `user_id`.

## Frontend

Connect to `/ws?userId=<current-user-id>` (in production, derive `userId` from JWT after auth). Incoming messages are JSON: `{"type":"notification","payload":{...}}`.
