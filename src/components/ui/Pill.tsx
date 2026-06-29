type PillProps = {
  className?: string
  children: React.ReactNode
}

export default function Pill({ className = '', children }: PillProps) {
  return (
    <div
      className={`flex items-center rounded-full bg-hdr-pill p-1 ${className}`}
    >
      {children}
    </div>
  )
}
