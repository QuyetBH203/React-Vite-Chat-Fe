import Peer from "peerjs"
import { create } from "zustand"

export interface PeerState {
  peer: Peer | null
  set: (peer: Peer) => void
  clear(): void
}

export const usePeer = create<PeerState>((set, state) => ({
  peer: null,
  set: (peer) => set({ peer }),
  clear: () => {
    state().peer?.destroy()
    set({ peer: null })
  },
}))
