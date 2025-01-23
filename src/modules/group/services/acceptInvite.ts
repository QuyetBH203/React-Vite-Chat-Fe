import { useMutation } from "@tanstack/react-query"
import { api } from "configs/api"

export interface AcceptInviteRequest {
  inviteCode: string
}

export interface AcceptInviteResponse {
  createdAt: string
  updatedAt: string
  isDeleted: boolean
  isOwner: boolean
  userId: string
  groupId: string
}

export async function acceptInvite({ inviteCode }: AcceptInviteRequest) {
  return (await api.post<AcceptInviteResponse>(`/group/join/${inviteCode}`))
    .data
}

export function useAcceptInvite() {
  return useMutation({
    mutationFn: acceptInvite,
  })
}
