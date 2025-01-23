import AuthLayout from "components/layouts/AuthLayout"
import HomeLayout from "components/layouts/home"
import { nav } from "constants/nav"
import { lazy } from "react"
import { RouteObject } from "react-router-dom"
import ChatMessages from "./pages/ChatMessages"
import Home from "./pages/Home"

export interface DirectMessageParams {
  id: string
}

const DirectMessages = lazy(() => import("./pages/DirectMessages"))

export const directMessageRoute: RouteObject = {
  path: nav.DIRECT_MESSAGE.slice(1),
  element: (
    <AuthLayout>
      <HomeLayout />
    </AuthLayout>
  ),
  children: [
    {
      path: "",
      Component: DirectMessages,
      children: [
        { path: "", Component: Home },
        {
          path: ":id",
          Component: ChatMessages,
        },
      ],
    },
  ],
}
