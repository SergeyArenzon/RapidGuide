import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { config } from './config'
import { healthRouter } from './routes/health'
import { startConsumer } from './rabbitmq/consumer'
import { handleMessage } from './rabbitmq/handler'

const app = new Hono()

app.use('*', logger())
app.route('/health', healthRouter)

// Start RabbitMQ consumer — runs in background, reconnects automatically
startConsumer([
  { queue: config.queues.notifications, handler: handleMessage },
  { queue: config.queues.reservationEvents, handler: handleMessage },
]).catch((err) => {
  console.error('[rabbitmq] fatal:', err)
  process.exit(1)
})

console.log(`[notification] listening on port ${config.httpPort}`)

export default {
  port: config.httpPort,
  fetch: app.fetch,
}
