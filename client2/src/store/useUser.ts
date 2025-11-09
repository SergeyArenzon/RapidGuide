import { create } from 'zustand'

export type AuthUser = {
  id: string
  name: string | null
  email: string
  emailVerified: boolean
  image: string | null
  createdAt: string
  updatedAt: string
}

type UserStore = {
  user: AuthUser | null
  accessToken: string | null
  isLogged: boolean
  setUser: (user: AuthUser, accessToken?: string | null) => void
  clearUser: () => void
}

const useUserStore = create<UserStore>((set) => ({
  user: null,
  accessToken: null,
  isLogged: false,
  setUser: (user, accessToken = null) => set({ user, accessToken, isLogged: true }),
  clearUser: () => set({ user: null, accessToken: null, isLogged: false }),
}))

export default useUserStore
