import { create } from 'zustand'
import type { TravellerDto } from '@rapid-guide-io/contracts'


type TravellerStore = {
  traveller: TravellerDto | null
  setTraveller: (traveller: TravellerDto) => void
  clearTraveller: () => void
}

export const useTravellerStore = create<TravellerStore>((set) => ({
  traveller: null,
  setTraveller: (traveller: TravellerDto) => set({ traveller }),
  clearTraveller: () => set({ traveller: null }),
}))

