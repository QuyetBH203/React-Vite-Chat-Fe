import AuthLayout from "components/layouts/AuthLayout"
import HomeLayout from "components/layouts/home"
import { nav } from "constants/nav"
import { Navigate, Outlet, RouteObject } from "react-router-dom"
import ChatGroupMessages from "./pages/ChatGroupMessages"
import DirectGroupMessages from "./pages/DirectGroupMessages"
import HomeGroupChannel from "./pages/HomeGroupChannel"
import InviteCode from "./pages/InviteCode"

export interface GroupMessageParams {
  groupId: string
  groupMessageChannelId: string
}

export interface JoinGroupParams {
  inviteCode: string
}

export const directGroupMessageRoute: RouteObject = {
  path: nav.GROUP.slice(1),
  element: (
    <AuthLayout>
      <HomeLayout />
    </AuthLayout>
  ),
  children: [
    {
      path: "",
      element: <Navigate to={"/"} />,
    },
    {
      path: ":groupId",
      Component: DirectGroupMessages,
      children: [
        {
          path: "",
          Component: HomeGroupChannel,
        },
        {
          path: ":groupMessageChannelId",
          Component: ChatGroupMessages,
        },
      ],
    },
  ],
}

export const joinGroupRoute: RouteObject = {
  path: nav.GROUP.slice(1) + nav.JOIN,
  element: (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  ),
  children: [
    {
      path: ":inviteCode",
      Component: InviteCode,
    },
  ],
}
