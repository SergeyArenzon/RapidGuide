
import { UserDto } from '@rapid-guide-io/dto'
import { create } from 'zustand'



type UserStore = {
  user: UserDto | null,
  accessToken: string | null,
  setUser: (user: UserDto, accessToken: string) => void 
  setAccessToken: (token: string) => void
  clearUser: () => void
  isLogged: boolean
}


const useUserStore = create<UserStore>((set) => ({
    user: null,
    accessToken: null,
    setUser: (user, accessToken) => set({ user, accessToken, isLogged: true }),
    setAccessToken: (token) => set({ accessToken: token }),
    clearUser: () => set({ user: null, accessToken: null, isLogged: false }),
    isLogged: false,

  }));



export default useUserStore;
