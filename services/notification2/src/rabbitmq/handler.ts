import type { NotificationMessage } from '../types/message'

// NestJS ClientProxy.emit() wraps payloads: {"pattern":"...","data":{...}}
// Detect by the presence of both "pattern" and "data" keys together.
function unwrap(body: Buffer): NotificationMessage {
  const parsed = JSON.parse(body.toString())
    console.log({parsed});
  if (parsed?.pattern !== undefined) {
    return parsed.data as NotificationMessage
  }
  return parsed as NotificationMessage
}

export async function handleMessage(body: Buffer): Promise<void> {
  const msg = unwrap(body)

  console.log(`[handler] notification for user ${msg.user_id} via [${msg.channels.join(', ')}]`)

  for (const channel of msg.channels) {
    switch (channel) {
      case 'email':
        console.log(`[email] send to user ${msg.user_id} — subject: "${msg.subject}"`)
        break
      case 'sms':
        console.log(`[sms] send to user ${msg.user_id} — subject: "${msg.subject}"`)
        break
      case 'push':
        console.log(`[push] push to user ${msg.user_id}`)
        break
      default:
        console.warn(`[handler] unknown channel "${channel}", skipping`)
    }
  }
}
