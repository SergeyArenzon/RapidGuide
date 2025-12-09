import { create } from 'zustand'
import type { SessionDto } from '@rapid-guide-io/contracts'


type SessionStore = {
  session: SessionDto | null
  isLoading: boolean
  setSession: (session: SessionDto) => void
  setLoading: (loading: boolean) => void
  clearSession: () => void
}

export const useSessionStore = create<SessionStore>((set) => ({
  session: null,
  isLoading: true,
  setSession: (session) => set({ session }),
  setLoading: (loading) => set({ isLoading: loading }),
  clearSession: () => set({ session: null, isLoading: true }),
}))

