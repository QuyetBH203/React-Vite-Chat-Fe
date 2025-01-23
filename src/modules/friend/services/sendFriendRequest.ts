import { useMutation } from "@tanstack/react-query"
import { api } from "configs/api"

export interface SendFriendRequestRequest {
  toUserId: string
}

export interface SendFriendRequestResponse {}

export async function sendFriendRequest({
  toUserId,
}: SendFriendRequestRequest) {
  return (await api.post(`/friend/request/${toUserId}`)).data
}

export function useSendFriendRequest() {
  return useMutation({
    mutationFn: sendFriendRequest,
  })
}
