import { api } from "configs/api"

export function acceptFriendRequest(fromUserId: string) {
  return api.post(`/friend/request/${fromUserId}/accept`)
}
