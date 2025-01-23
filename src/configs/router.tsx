import { nav } from "constants/nav"
import { directMessageRoute } from "modules/direct-message/route"
import { directGroupMessageRoute, joinGroupRoute } from "modules/group/route"
import { Navigate, createBrowserRouter } from "react-router-dom"
import { authRoute } from "../modules/auth/route"

export const router = createBrowserRouter([
  authRoute,
  directMessageRoute,
  directGroupMessageRoute,
  joinGroupRoute,
  {
    path: "*",
    element: <Navigate to={nav.AUTH + nav.SIGN_IN} />,
  },
])
