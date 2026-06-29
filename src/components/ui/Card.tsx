type CardProps = {
  className?: string
  children: React.ReactNode
}

export default function Card({ className = '', children }: CardProps) {
  return (
    <div
      className={`bg-panel rounded-xl ${className}`}
    >
      {children}
    </div>
  )
}
