import axios, { AxiosError, AxiosHeaders } from "axios"
import { refreshToken } from "modules/auth/services/refreshToken"
import toast from "react-hot-toast"
import { useUser } from "store/user"

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.request.use((config) => {
  const accessToken = useUser.getState().auth.accessToken
  if (accessToken)
    (config.headers as AxiosHeaders).set(
      "Authorization",
      `Bearer ${accessToken}`,
    )
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config

    if (
      error.response?.status === 401 &&
      config?.url !== "/auth/user/refresh-token"
    ) {
      const userAuth = useUser.getState().auth
      if (!userAuth.refreshToken) {
        return Promise.reject(error)
      }
      try {
        const data = await refreshToken({ refreshToken: userAuth.refreshToken })
        if (data) {
          useUser.getState().setAuth(data)
          return api(config!)
        }
      } catch (error) {
        toast.error("Session expired, please re-login")
        useUser.getState().clear()
      }
    }
    return Promise.reject(error)
  },
)
