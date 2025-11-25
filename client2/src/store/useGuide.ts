import { create } from 'zustand'
import type { GuideDto } from '@rapid-guide-io/contracts'


type GuideStore = {
  guide: GuideDto | null
  setGuide: (user: GuideDto) => void
  clearGuide: () => void
}

export const useGuideStore = create<GuideStore>((set) => ({
  guide: null,
  setGuide: (guide: GuideDto) => set({ guide }),
  clearGuide: () => set({ guide: null }),
}))

