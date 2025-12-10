import { create } from 'zustand'
import type { UserDto } from '@rapid-guide-io/contracts'


type UserStore = {
  user: UserDto | null
  accessToken: string | null
  isLogged: boolean
  setUser: (user: UserDto, accessToken?: string | null) => void
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
