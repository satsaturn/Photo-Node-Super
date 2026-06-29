import { create } from 'zustand'

export type CategoryId = 'themes' | 'storage' | 'performance' | 'keys' | 'display' | 'workspace'

export interface SettingsState {
  isOpen: boolean
  activeCategory: CategoryId
  open: () => void
  close: () => void
  toggle: () => void
  setActiveCategory: (category: CategoryId) => void
}

export const useSettingsStore = create<SettingsState>()((set) => ({
  isOpen: false,
  activeCategory: 'themes',
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  setActiveCategory: (category) => set({ activeCategory: category }),
}))
