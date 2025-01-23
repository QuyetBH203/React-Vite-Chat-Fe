import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { api } from "configs/api"
import { MessageType } from "modules/direct-message/services/sendMessage"
import { BaseGetList, PageParam } from "types/getList"
import { Group } from "types/group"
import { User } from "types/user"

//types

export interface GetGroupProfileRequest {
  groupId: string
}

export interface GetGroupProfileResponse extends Group {}

export interface GetGroupResponse {
  group: Group
  user: {
    _count: {
      groups: number
    }
  }
}

export interface GetGroupListRequest {
  take?: number
}

export interface GetGroupListResponse extends BaseGetList {
  data: GetGroupResponse[]
}

export interface GetGroupChatChannelResponse {
  group: Group
  user: {
    _count: {
      groups: number
    }
  }
}

export interface GetLastGroupMessageResponse {
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

export interface GetGroupChatChannelResponse {
  id: string
  createdAt: string
  updatedAt: string
  isDeleted: boolean
  name: string
  groupId: string
  lastMessage: GetLastGroupMessageResponse
}

export interface GetGroupChatChannelListResponse extends BaseGetList {
  data: GetGroupChatChannelResponse[]
}

export interface GetGroupChatChannelListRequest {
  groupId?: string
  take?: number
  page?: number
}

export interface GetGroupChannelRequest {
  groupId: string
  groupMessageChannelId: string
}

export interface GetGroupChannelResponse {
  id: string
  createdAt: string
  updatedAt: string
  isDeleted: boolean
  name: string
  groupId: string
}

//hook

export async function getGroupProfile(groupId: string) {
  return (await api.get<GetGroupProfileResponse>(`/group/${groupId}`)).data
}

export function useGetGroupProfile({ groupId }: GetGroupProfileRequest) {
  return useQuery({
    queryKey: ["getGroup", groupId],
    queryFn: async () => await getGroupProfile(groupId),
    refetchInterval: 10000,
    retry: 0,
  })
}

export async function getGetGroupList(pageParam: PageParam, take: number) {
  return (
    await api.get<GetGroupListResponse>(
      `/group/joined?page=${pageParam.page}&take=${take}`,
    )
  ).data
}

export function useGetGroupList({ take = 20 }: GetGroupListRequest) {
  return useInfiniteQuery({
    queryKey: ["getGroupList", take],

    queryFn: async ({ pageParam }) => await getGetGroupList(pageParam, take),

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

export async function getGroupChatChannelList({
  groupId,
  ...params
}: GetGroupChatChannelListRequest) {
  return (
    await api.get<GetGroupChatChannelListResponse>(
      `/group-message-channel/${groupId}`,
      {
        params,
      },
    )
  ).data
}

export function useGetGroupChatChannelList({
  groupId = "",
  take = 10,
}: GetGroupChatChannelListRequest) {
  return useInfiniteQuery({
    queryKey: ["getGroupChatChannelList", groupId, take],

    queryFn: async ({ pageParam: { page } }) =>
      await getGroupChatChannelList({ groupId, take, page }),

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

export async function getGroupChannel(params: GetGroupChannelRequest) {
  return (
    await api.get<GetGroupChannelResponse>(
      `/group-message-channel/${params.groupId}/${params.groupMessageChannelId}`,
    )
  ).data
}

export function useGetGroupChannel(
  params: GetGroupChannelRequest,
  enabled: boolean,
) {
  return useQuery({
    queryKey: ["getGroupChannel", params.groupId, params.groupMessageChannelId],
    queryFn: async () => await getGroupChannel(params),
    enabled,
  })
}
