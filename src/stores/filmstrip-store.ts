import { create } from 'zustand'

export type FilmstripPhoto = {
  id: string
  name: string
  thumbnail: string
}

export interface FilmstripState {
  photos: FilmstripPhoto[]
  activePhotoId: string | null
  height: number
  selectPhoto: (id: string) => void
  setHeight: (h: number) => void
}

const defaultPhotos: FilmstripPhoto[] = Array.from({ length: 50 }, (_, i) => ({
  id: `photo${String(i + 1).padStart(2, '0')}`,
  name: `DSC_${String(i + 2).padStart(4, '0')}.jpg`,
  thumbnail: `https://picsum.photos/seed/photo${String(i + 2).padStart(2, '0')}/144/96`,
}))

export const useFilmstripStore = create<FilmstripState>()((set) => ({
  photos: defaultPhotos,
  activePhotoId: defaultPhotos[0]?.id ?? null,
  height: 120,
  selectPhoto: (id) => set({ activePhotoId: id }),
  setHeight: (h) => set({ height: Math.max(74, Math.min(200, h)) }),
}))
