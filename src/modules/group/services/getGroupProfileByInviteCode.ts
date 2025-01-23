import { useQuery } from "@tanstack/react-query"
import { api } from "configs/api"
import { Group } from "types/group"
import { UserProfile } from "types/user"

export interface GetGroupProfileByInviteCodeRequest {
  inviteCode: string
}

export interface GetGroupProfileByInviteCodeResponse
  extends Omit<Group, "_count"> {
  owner: {
    profile: UserProfile
  }
}

export async function getGroupProfileByInviteCode({
  inviteCode,
}: GetGroupProfileByInviteCodeRequest) {
  return (
    await api.post<GetGroupProfileByInviteCodeResponse>(
      `/group/check-invite-code/${inviteCode}`,
    )
  ).data
}

export function useGetGroupProfileByInviteCode({
  inviteCode,
}: GetGroupProfileByInviteCodeRequest) {
  return useQuery({
    queryKey: ["getGroupProfileByInviteCode", inviteCode],
    queryFn: async () => await getGroupProfileByInviteCode({ inviteCode }),
  })
}
