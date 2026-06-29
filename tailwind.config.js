/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}', './index.html'],
  theme: {
    extend: {
      colors: {
        hdr: {
          DEFAULT: 'var(--hdr)',
          pill: 'var(--hdr-pill)',
          'pill-hi': 'var(--hdr-pill-hi)',
          text: 'var(--hdr-text)',
          muted: 'var(--hdr-muted)',
          divider: 'var(--hdr-divider)',
        },
        panel: {
          DEFAULT: 'var(--panel)',
          border: 'var(--panel-border)',
          text: 'var(--panel-text)',
          'text-2': 'var(--panel-text-2)',
          'text-3': 'var(--panel-text-3)',
          hover: 'var(--panel-hover)',
          section: 'var(--panel-section)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
        },
        track: {
          bg: 'var(--track-bg)',
        },
        canvas: 'var(--bg)',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
