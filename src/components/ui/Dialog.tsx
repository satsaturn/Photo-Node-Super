import { useEffect, useCallback } from 'react'
import Card from './Card'

type DialogProps = {
  isOpen: boolean
  onClose: () => void
  title: string
  hideHeader?: boolean
  children: React.ReactNode
}

export default function Dialog({ isOpen, onClose, title, hideHeader = false, children }: DialogProps) {
  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', onKeyDown)
      return () => document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen, onKeyDown])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <Card className="w-[640px] max-h-[80vh] flex flex-col overflow-hidden border border-panel-border relative">
        <button
          onClick={onClose}
          className={`absolute top-0 right-0 z-10 w-7 h-7 rounded-full flex items-center justify-center text-panel-text-2 hover:text-panel-text hover:bg-panel-hover transition-colors ${hideHeader ? '' : 'hidden'}`}
          aria-label="Close"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        {!hideHeader && (
          <div className="flex items-center justify-between px-5 py-3 border-b border-panel-border shrink-0">
            <h2 className="text-sm font-semibold text-panel-text">{title}</h2>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full flex items-center justify-center text-panel-text-2 hover:text-panel-text hover:bg-panel-hover transition-colors"
              aria-label="Close"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-5">
          {children}
        </div>
      </Card>
    </div>
  )
}
