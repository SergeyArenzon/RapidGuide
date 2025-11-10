import { create } from 'zustand'
import { authClient } from '@/lib/auth-client'

type AuthSessionQuery = ReturnType<typeof authClient.getSession>
export type SessionData =
  AuthSessionQuery extends { data: infer T } ? T | null : null
export type SessionError =
  AuthSessionQuery extends { error: infer E } ? E | null : unknown | null

type SessionStore = {
  session: SessionData
  isLoading: boolean
  error: SessionError
  setSession: (session: SessionData) => void
  setLoading: (loading: boolean) => void
  setError: (error: SessionError) => void
  clearSession: () => void
}

export const useSessionStore = create<SessionStore>((set) => ({
  session: null as SessionData,
  isLoading: true,
  error: null as SessionError,
  setSession: (session) => set({ session }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearSession: () => set({ session: null, isLoading: true, error: null }),
}))

