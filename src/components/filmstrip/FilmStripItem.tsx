import type { FilmstripPhoto } from '../../stores/filmstrip-store'

type FilmStripItemProps = {
  photo: FilmstripPhoto
  isActive: boolean
  onClick: () => void
}

export default function FilmStripItem({ photo, isActive, onClick }: FilmStripItemProps) {
  return (
    <button
      onClick={onClick}
      onDragStart={(e) => e.preventDefault()}
      className={`shrink-0 overflow-hidden transition-none h-full aspect-[3/2] ${
        isActive ? 'outline outline-1 outline-accent -outline-offset-1' : ''
      }`}
    >
      <img
        src={photo.thumbnail}
        alt={photo.name}
        className="w-full h-full object-cover pointer-events-none"
      />
    </button>
  )
}
