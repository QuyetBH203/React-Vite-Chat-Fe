import { User } from "types/user"

export enum DirectCallChannelType {
  AUDIO = "AUDIO",
  VIDEO = "VIDEO",
}

export interface DirectCallChannel {
  id: string
  createdAt: string
  updatedAt: string
  isDeleted: boolean
  createdById: string
  type: DirectCallChannelType

  users: [{ user: User }]
}
