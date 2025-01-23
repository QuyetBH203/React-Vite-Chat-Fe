export interface Group {
  id: string
  createdAt: string
  updatedAt: string
  isDeleted: boolean
  name: string
  imageUrl: string
  ownerId: string
  inviteCode: string
  inviteCodeMaxNumberOfUses: number
  inviteCodeNumberOfUses: number
  _count: {
    users: number
    channels: number
  }
}

export interface ChatChannel {
  id: string
  createdAt: string
  updatedAt: string
  isDeleted: boolean
  name: string
  groupId: string
}
