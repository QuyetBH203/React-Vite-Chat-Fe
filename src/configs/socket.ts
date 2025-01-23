import { io } from "socket.io-client"
import { useUser } from "store/user"

export const socket = io(import.meta.env.VITE_API_URL, {
  auth: {
    accessToken: useUser.getState().auth.accessToken,
  },
})
