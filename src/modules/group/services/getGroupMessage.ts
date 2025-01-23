import { useInfiniteQuery } from "@tanstack/react-query"
import { api } from "configs/api"
import { MessageType } from "modules/direct-message/services/sendMessage"
import { BaseGetList, PageParam } from "types/getList"
import { User } from "types/user"

export interface GetGroupMessageChannelRequest {
  groupId: string
  groupMessageChannelId: string
  page?: number
  take?: number
}

export interface GetGroupMessageChannelResponse {
  id: string
  createdAt: string
  updatedAt: string
  isDeleted: boolean
  type: MessageType
  value: string
  userId: string
  groupMessageChannelId: string
  user: Pick<User, "profile">
}

export interface GetGroupMessageListChannelResponse extends BaseGetList {
  data: GetGroupMessageChannelResponse[]
}

export interface GetGroupMessageResponse {
  id: string
  isDeleted: boolean
  type: MessageType
  value: string
  userId: string
  groupMessageChannelId: string
  user: Pick<User, "profile">
  createdAt: string
  updatedAt: string
}

export async function getGroupMessageListChannel({
  groupId,
  groupMessageChannelId,
  ...params
}: GetGroupMessageChannelRequest) {
  return (
    await api.get<GetGroupMessageListChannelResponse>(
      `/group-message-channel/${groupId}/${groupMessageChannelId}/message`,
      { params },
    )
  ).data
}

export function useGetGroupMessageListChannel({
  take = 20,
  ...props
}: GetGroupMessageChannelRequest) {
  return useInfiniteQuery({
    queryKey: [
      `getGroupMessageListChannel-${props.groupId}-${props.groupMessageChannelId}`,
      props.groupId,
      props.groupMessageChannelId,
      take,
      props.page,
    ],

    queryFn: async ({ pageParam: { page } }) =>
      await getGroupMessageListChannel({
        ...props,
        take,
        page,
      }),

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
  })
}
