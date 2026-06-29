type CardProps = {
  className?: string
  children: React.ReactNode
}

export default function Card({ className = '', children }: CardProps) {
  return (
    <div
      className={`bg-[rgba(var(--panel-rgb),var(--panel-opacity,0.85))] rounded-xl ${className}`}
    >
      {children}
    </div>
  )
}
