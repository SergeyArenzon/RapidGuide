import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Role = "guide" | "traveller"

type RoleStore = {
  role: Role | null
  setRole: (mode: Role) => void
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


