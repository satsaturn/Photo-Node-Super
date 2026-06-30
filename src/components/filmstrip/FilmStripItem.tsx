import type { FilmstripPhoto } from '../../stores/filmstrip-store'

type FilmStripItemProps = {
  photo: FilmstripPhoto
  isActive: boolean
}

export default function FilmStripItem({ photo, isActive }: FilmStripItemProps) {
  return (
    <button
      data-photo-id={photo.id}
      onDragStart={(e) => e.preventDefault()}
      className="shrink-0 overflow-hidden transition-none h-full aspect-[3/2] relative"
    >
      <img
        src={photo.thumbnail}
        alt={photo.name}
        className="w-full h-full object-cover pointer-events-none"
      />
      {!isActive && (
        <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(0,0,0,1)] pointer-events-none" />
      )}
    </button>
  )
}
