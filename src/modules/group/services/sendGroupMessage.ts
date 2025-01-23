import { MessageType } from "modules/direct-message/services/sendMessage"

export interface CreateGroupMessageRequest {
  groupMessageChannelId: string
  type: MessageType
  value: string
}
