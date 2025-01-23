import InCallModal from "./InCallModal"
import IncomingCallModal from "./IncomingCallModal"
import RequestCallModal from "./RequestCallModal"

export default function DirectCallOverlay() {
  return (
    <>
      <RequestCallModal />
      <IncomingCallModal />
      <InCallModal />
    </>
  )
}
