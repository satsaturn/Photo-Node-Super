type FilmstripFrameProps = {
  src?: string
  name?: string
  active?: boolean
  width: number
  height: number
  onClick?: () => void
}

export default function FilmstripFrame({ src, name, active, width, height, onClick }: FilmstripFrameProps) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 overflow-hidden cursor-pointer border transition-colors ${
        active
          ? 'rounded-xl border-accent'
          : 'rounded-lg border-panel-border hover:border-panel-text-3'
      }`}
      style={{ width, height }}
      title={name}
    >
      {src ? (
        <img src={src} alt={name ?? ''} className="w-full h-full object-cover block" />
      ) : (
        <div className="w-full h-full bg-[#1a1a1f]" />
      )}
    </button>
  )
}
