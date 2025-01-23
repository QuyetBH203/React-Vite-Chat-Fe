import { api } from "configs/api"

export function cancelFriendRequest(fromUserId: string) {
  return api.post(`/friend/request/${fromUserId}/cancel`)
}
