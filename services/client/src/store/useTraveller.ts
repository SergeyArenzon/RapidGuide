import { create } from 'zustand'
import type { GuideDto } from '@rapid-guide-io/contracts'


type TravellerStore = {
  traveller: GuideDto | null
  setTraveller: (traveller: GuideDto) => void
  clearTraveller: () => void
}

export const useTravellerStore = create<TravellerStore>((set) => ({
  traveller: null,
  setTraveller: (traveller: GuideDto) => set({ traveller }),
  clearTraveller: () => set({ traveller: null }),
}))

