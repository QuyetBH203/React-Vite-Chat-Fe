import { useMutation } from "@tanstack/react-query"
import { api } from "configs/api"
import { Group } from "types/group"

export interface GenerateInviteCodeRequest {
  inviteCodeMaxNumberOfUses?: number
}

export interface GenerateInviteCodeResponse extends Omit<Group, "_count"> {}

interface Props extends GenerateInviteCodeRequest {
  groupId: string
}

export async function generateInviteCode({ groupId, ...data }: Props) {
  return (
    await api.post<GenerateInviteCodeResponse>(
      `/group/${groupId}/invite-code`,
      data,
    )
  ).data
}

export function useGenerateInviteCode() {
  return useMutation({
    mutationFn: generateInviteCode,
  })
}
