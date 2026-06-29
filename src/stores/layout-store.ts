import { create } from 'zustand'

export interface LayoutState {
  columnWidth: number
  setColumnWidth: (w: number) => void
}

export const useLayoutStore = create<LayoutState>()((set) => ({
  columnWidth: 320,
  setColumnWidth: (w) => set({ columnWidth: Math.max(240, Math.min(640, w)) }),
}))
