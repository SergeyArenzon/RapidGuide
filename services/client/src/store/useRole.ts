import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Roles = "guide" | "traveller"

type RoleStore = {
  role: Roles | null
  setRole: (mode: Roles) => void
}

export const useRoleStore = create<RoleStore>()(
  persist(
    (set) => ({
      role: null,
      setRole: (mode) => set({ role: mode }),
    }),
    {
      name: 'role-storage', // unique name for localStorage key
    }
  )
)


