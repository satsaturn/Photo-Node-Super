import { create } from 'zustand'

export type CategoryId = 'themes' | 'storage' | 'performance' | 'keys' | 'display' | 'workspace'

export interface SettingsStore {
  isOpen: boolean
  activeCategory: CategoryId
  open: () => void
  close: () => void
  toggle: () => void
  setActiveCategory: (category: CategoryId) => void
}

export const useSettingsStore = create<SettingsStore>()((set) => ({
  isOpen: false,
  activeCategory: 'themes',
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  setActiveCategory: (category) => set({ activeCategory: category }),
}))
