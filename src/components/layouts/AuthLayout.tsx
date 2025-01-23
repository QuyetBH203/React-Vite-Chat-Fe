import axios from "axios"
import LoadingPage from "components/common/LoadingPage"
import { socket } from "configs/socket"
import { nav } from "constants/nav"
import { useGetUserProfile } from "modules/user/services/getUserProfile"
import Peer from "peerjs"
import { PropsWithChildren, useEffect, useState } from "react"
import { Navigate } from "react-router"
import { usePeer } from "store/peer"
import { useUser } from "store/user"

export default function AuthLayout({ children }: PropsWithChildren) {
  const [loading, setLoading] = useState<boolean>(true)

  const { user, auth, setUser } = useUser()
  const getUserProfile = useGetUserProfile()
  const peer = usePeer()

  useEffect(() => {
    if (auth.accessToken)
      getUserProfile.mutate(undefined, {
        onSuccess(data) {
          if (data.profile.fullName) {
            setUser(data)
          }
        },
      })
  }, [auth, setUser])

  useEffect(() => {
    if (
      getUserProfile.isSuccess ||
      getUserProfile.isError ||
      !auth.accessToken
    ) {
      setLoading(false)
    }
  }, [getUserProfile.isSuccess, getUserProfile.isError, auth.accessToken])

  useEffect(() => {
    if (user.id) {
      socket.auth = {
        accessToken: auth.accessToken,
      }
      socket.connect()

      return () => {
        socket.disconnect()
      }
    }
  }, [user])

  useEffect(() => {
    if (user.id) {
      axios
        .get(
          "https://idea-meeting.metered.live/api/v1/turn/credentials?apiKey=e3f696802a20d03870c4d2c8b452ca3fc20c",
        )
        .then((data) => {
          peer.set(
            new Peer(user.id, {
              config: {
                iceServers: data.data,
              },
            }),
          )
        })
    }

    return () => {
      peer.clear()
    }
  }, [user, peer.set, peer.clear])

  if (!loading) {
    return user.id ? children : <Navigate to={nav.AUTH + nav.SIGN_IN} replace />
  }

  return <LoadingPage />
}
