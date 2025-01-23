import { useMutation } from "@tanstack/react-query"
import { api } from "configs/api"
import { Group } from "types/group"

export interface TransferOwnershipRequest {
  groupId: string
  targetId: string
}

export interface TransferOwnershipResponse extends Omit<Group, "_count"> {}

export async function transferOwnership({
  groupId,
  targetId,
}: TransferOwnershipRequest) {
  return (
    await api.post<TransferOwnershipResponse>(
      `/group/${groupId}/transfer-ownership/${targetId}`,
    )
  ).data
}

export function useTransferOwnership() {
  return useMutation({
    mutationFn: transferOwnership,
  })
}
