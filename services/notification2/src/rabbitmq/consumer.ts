import amqp from 'amqplib'
import { config } from '../config'

export type MessageHandler = (body: Buffer) => Promise<void>

export type QueueConfig = {
  queue: string
  handler: MessageHandler
}

const RECONNECT_DELAY_MS = 5_000

async function connect(queues: QueueConfig[]): Promise<void> {
  const conn = await amqp.connect(config.amqpUrl)
  const ch = await conn.createChannel()

  for (const { queue, handler } of queues) {
    await ch.assertQueue(queue, { durable: true })
    await ch.consume(
      queue,
      async (msg) => {
        if (!msg) return
        try {
          await handler(msg.content)
          ch.ack(msg)
        } catch (err) {
          console.error(`[rabbitmq] handler error on queue "${queue}":`, err)
          ch.nack(msg, false, true) // requeue
        }
      },
      { noAck: false },
    )
    console.log(`[rabbitmq] consuming from queue "${queue}"`)
  }

  // Block until the connection drops
  return new Promise<void>((_, reject) => {
    conn.on('close', () => reject(new Error('connection closed')))
    conn.on('error', reject)
  })
}

// startConsumer runs forever, reconnecting after failures
export async function startConsumer(queues: QueueConfig[]): Promise<void> {
  while (true) {
    try {
      await connect(queues)
    } catch (err) {
      console.error('[rabbitmq] error:', err)
      console.log(`[rabbitmq] reconnecting in ${RECONNECT_DELAY_MS / 1000}s...`)
      await Bun.sleep(RECONNECT_DELAY_MS)
    }
  }
}
