import { useEffect, useMemo } from 'react'
import { useThemeStore } from '../stores/theme-store'

function grainDataUri(strength: number): string {
  const size = 256
  const c = document.createElement('canvas')
  c.width = size
  c.height = size
  const ctx = c.getContext('2d')!
  const img = ctx.createImageData(size, size)
  const f = strength / 100
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.floor(128 + (Math.random() * 2 - 1) * 128 * f)
    img.data[i] = v
    img.data[i + 1] = v
    img.data[i + 2] = v
    img.data[i + 3] = 255
  }
  ctx.putImageData(img, 0, 0)
  return c.toDataURL()
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { mode, accent, highContrast, panelOpacity, grainStrength } = useThemeStore()

  const grainUrl = useMemo(() => grainDataUri(grainStrength), [grainStrength])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode)
  }, [mode])

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', accent)
  }, [accent])

  useEffect(() => {
    if (highContrast) {
      document.documentElement.setAttribute('data-high-contrast', 'true')
    } else {
      document.documentElement.removeAttribute('data-high-contrast')
    }
  }, [highContrast])

  useEffect(() => {
    document.documentElement.style.setProperty('--panel-opacity', String(panelOpacity / 100))
  }, [panelOpacity])

  useEffect(() => {
    const body = document.body
    if (grainStrength > 0) {
      body.style.setProperty('--grain-image', `url("${grainUrl}")`)
      body.classList.add('has-grain')
      body.style.backgroundImage = ''
      body.style.backgroundSize = ''
      body.style.backgroundRepeat = ''
      body.style.backgroundBlendMode = ''
    } else {
      body.classList.remove('has-grain')
    }
  }, [grainStrength, grainUrl])

  return <>{children}</>
}
