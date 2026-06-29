import { type ButtonHTMLAttributes } from 'react'

type PillButtonProps = {
  active?: boolean
  variant?: 'text' | 'icon'
} & ButtonHTMLAttributes<HTMLButtonElement>

export default function PillButton({
  active = false,
  disabled = false,
  variant = 'text',
  onClick,
  className = '',
  children,
  ...rest
}: PillButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded-full border-0 font-sans font-medium leading-none transition-colors select-none'
  const sizing =
    variant === 'icon'
      ? 'p-1'
      : 'px-[18px] py-[6px] text-[14px] gap-1.5'
  const state = active
    ? 'bg-accent text-white'
    : disabled
      ? 'text-hdr-muted cursor-not-allowed'
      : 'bg-transparent text-hdr-text hover:bg-hdr-pill-hi cursor-pointer'

  return (
    <button
      className={`${base} ${sizing} ${state} ${className}`}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      {...rest}
    >
      {children}
    </button>
  )
}
