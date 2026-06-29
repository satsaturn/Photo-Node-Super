type SectionProps = {
  label: string
  children?: React.ReactNode
  className?: string
  actions?: React.ReactNode
}

export default function Section({
  label,
  children,
  className = '',
  actions,
}: SectionProps) {
  return (
    <div
      className={`bg-[rgba(var(--panel-rgb),var(--panel-opacity,0.85))] border border-panel-border rounded-lg overflow-hidden ${className}`}
    >
      <div className="flex items-center gap-2 px-2 py-2 text-xs font-semibold select-none bg-panel-section text-panel-text">
        <span className="flex-1">{label}</span>
        {actions}
      </div>

      {children && (
        <div className="p-2">
          {children}
        </div>
      )}
    </div>
  )
}
