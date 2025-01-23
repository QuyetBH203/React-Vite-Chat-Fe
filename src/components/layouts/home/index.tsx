import CallOverlay from "modules/direct-call/components/DirectCallOverlay"
import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"

export default function HomeLayout() {
  return (
    <div className="h-screen grid grid-cols-[72px,1fr] overflow-y-hidden">
      <Sidebar />
      <Outlet />
      <CallOverlay />
    </div>
  )
}
