import { useInfiniteQuery } from "@tanstack/react-query"
import { api } from "configs/api"
import { BaseGetList, PageParam } from "types/getList"
import { UserProfile } from "types/user"

export interface GetGroupMembersListRequest {
  groupId: string
  page?: number
  take?: number
}

export interface GetGroupMembersResponse {
  isOwner: boolean
  user: {
    id: string
    isOnline: string
    profile: UserProfile
  }
}

export interface GetGroupMembersListResponse extends BaseGetList {
  data: GetGroupMembersResponse[]
}

export async function getGroupMembersList({
  groupId,
  ...params
}: GetGroupMembersListRequest) {
  return (
    await api.get<GetGroupMembersListResponse>(`/group/${groupId}/members`, {
      params,
    })
  ).data
}

export function useGetGroupMembersList({
  take = 20,
  groupId,
}: GetGroupMembersListRequest) {
  return useInfiniteQuery({
    queryKey: ["getGroupMembersList", take, groupId],

    queryFn: async ({ pageParam }) =>
      await getGroupMembersList({ groupId, page: pageParam.page, take }),

    initialPageParam: {
      page: 1,
    } as PageParam,
    getNextPageParam: (lastPage) => {
      if (!lastPage) {
        return
      }

      const { page, take, total } = lastPage.meta

      if (page * take > total) {
        return
      }

      return {
        page: page + 1,
      }
    },
    refetchInterval: 10000,
  })
}
