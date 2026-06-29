import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeMode = 'white' | 'light' | 'dark' | 'black'

export interface ThemeState {
  mode: ThemeMode
  accent: string
  highContrast: boolean
  panelOpacity: number
  grainStrength: number
}

export interface ThemeActions {
  setMode: (mode: ThemeMode) => void
  setAccent: (accent: string) => void
  setHighContrast: (highContrast: boolean) => void
  setPanelOpacity: (panelOpacity: number) => void
  setGrainStrength: (grainStrength: number) => void
}

export type ThemeStore = ThemeState & ThemeActions

export const accentSwatches = [
  '#6ea8ff',
  '#4ec9b0',
  '#22c55e',
  '#f97316',
  '#ef4444',
  '#a855f7',
  '#ec4899',
  '#d4a017',
]

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      mode: 'light',
      accent: accentSwatches[0],
      highContrast: false,
      panelOpacity: 85,
      grainStrength: 40,
      setMode: (mode) => set({ mode }),
      setAccent: (accent) => set({ accent }),
      setHighContrast: (highContrast) => set({ highContrast }),
      setPanelOpacity: (panelOpacity) => set({ panelOpacity }),
      setGrainStrength: (grainStrength) => set({ grainStrength }),
    }),
    { name: 'photo-node-theme' }
  )
)
