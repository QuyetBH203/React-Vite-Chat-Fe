export type MessageType = "TEXT" | "IMAGE"

export interface CreateDirectMessageRequest {
  directMessageChannelId: string
  type: MessageType
  value: string
}
