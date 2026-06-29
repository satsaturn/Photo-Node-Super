import { type ButtonHTMLAttributes } from 'react'

type PillButtonProps = {
  active?: boolean
  icon?: boolean
} & ButtonHTMLAttributes<HTMLButtonElement>

export default function PillButton({
  active = false,
  icon = false,
  disabled = false,
  onClick,
  className = '',
  children,
  ...rest
}: PillButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded-full border-0 font-sans text-sm font-medium leading-none transition-colors select-none'
  const padding = icon ? 'px-2.5 py-[3px]' : 'px-3 py-1.5'
  const state = active
    ? 'bg-accent text-white'
    : disabled
      ? 'text-hdr-muted cursor-not-allowed'
      : 'bg-transparent text-hdr-text hover:bg-hdr-pill-hi cursor-pointer'

  return (
    <button
      className={`${base} ${padding} ${state} ${className}`}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      {...rest}
    >
      {children}
    </button>
  )
}
