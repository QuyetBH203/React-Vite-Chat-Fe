import { useInfiniteQuery } from "@tanstack/react-query"
import { api } from "configs/api"
import { BaseGetList, PageParam } from "types/getList"

export interface GetUserListRequest {
  take?: number
  keyword?: string
  notInGroupId?: string
}

export interface GetUserResponse {
  createdAt: string
  updatedAt: string
  isDeleted: boolean
  avatarUrl: string
  fullName: string
  gender: string
  userId: string
}

export interface GetUserListResponse extends BaseGetList {
  data: GetUserResponse[]
}

export async function getUserList(
  page: number,
  take: number,
  keyword?: string,
  notInGroupId?: string,
) {
  return (
    await api.get<GetUserListResponse>(`/user`, {
      params: { page, take, keyword, notInGroupId },
    })
  ).data
}

export function useGetUserList(
  { take = 10, keyword, notInGroupId }: GetUserListRequest,
  enabled?: boolean,
) {
  return useInfiniteQuery({
    queryKey: ["get-user-list", take, keyword, notInGroupId],

    queryFn: async ({ pageParam }) =>
      await getUserList(pageParam.page, take, keyword, notInGroupId),

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
    enabled,
  })
}
