import { useEffect, useCallback } from 'react'
import Card from './Card'
import { CloseIcon } from './icons'

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
          className={`absolute top-2 right-2 z-10 w-7 h-7 rounded-full flex items-center justify-center text-panel-text-2 hover:text-panel-text hover:bg-panel-hover transition-colors ${hideHeader ? '' : 'hidden'}`}
          aria-label="Close"
        >
          <CloseIcon />
        </button>
        {!hideHeader && (
          <div className="flex items-center justify-between p-4 border-b border-panel-border shrink-0">
            <h2 className="text-sm font-semibold text-panel-text">{title}</h2>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full flex items-center justify-center text-panel-text-2 hover:text-panel-text hover:bg-panel-hover transition-colors"
              aria-label="Close"
            >
              <CloseIcon />
            </button>
          </div>
        )}
        <div className={`flex-1 overflow-y-auto ${hideHeader ? 'p-8' : 'p-4'}`}>
          {children}
        </div>
      </Card>
    </div>
  )
}
