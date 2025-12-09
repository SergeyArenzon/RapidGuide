import { create } from 'zustand'

interface JwtTokenStore {
  token: string | null
  setToken: (token: string) => void
  clearToken: () => void
  getToken: () => string | null
}

export const useJwtTokenStore = create<JwtTokenStore>((set, get) => ({
  token: null,
  setToken: (token: string) => set({ token }),
  clearToken: () => set({ token: null }),
  getToken: () => get().token,
}))
