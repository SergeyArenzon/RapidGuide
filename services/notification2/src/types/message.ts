export type NotificationMessage = {
  user_id: string
  channels: string[]
  template: string
  subject: string
  data: Record<string, string>
}
