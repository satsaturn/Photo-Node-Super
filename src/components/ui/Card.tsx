type CardProps = {
  className?: string
  children: React.ReactNode
}

export default function Card({ className = '', children }: CardProps) {
  return (
    <div
      className={`bg-panel rounded-xl p-2 ${className}`}
    >
      {children}
    </div>
  )
}
