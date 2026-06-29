type ToggleProps = {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}

export default function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <span
        className={`w-7 h-4 rounded-full transition-colors ${
          checked ? 'bg-accent' : 'bg-track-bg'
        } relative`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white transition-transform ${
            checked ? 'translate-x-3' : 'translate-x-0'
          }`}
        />
      </span>
      <span className="text-sm text-panel-text">{label}</span>
    </label>
  )
}
