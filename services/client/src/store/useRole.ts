import { create } from 'zustand'

export type Roles = "guide" | "traveller"

type RoleStore = {
  role: Roles | null
  setRole: (mode: Roles) => void
}

export const useRoleStore = create<RoleStore>((set) => ({
  role: null,
  setRole: (mode) => set({ role: mode }),
}))


