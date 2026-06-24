import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#138266',
          hover: '#0f6b54',
          active: '#0c5643',
          light: '#e8f5f1',
          border: '#92cabb',
          bg: '#f0faf7',
          foreground: '#ffffff',
        },
        status: {
          scheduled: '#138266',
          'scheduled-bg': '#e8f5f1',
          'scheduled-text': '#0c5643',
          completed: '#16a34a',
          'completed-bg': '#f0fdf4',
          'completed-text': '#14532d',
          cancelled: '#dc2626',
          'cancelled-bg': '#fef2f2',
          'cancelled-text': '#991b1b',
          rescheduled: '#9333ea',
          'rescheduled-bg': '#faf5ff',
          'rescheduled-text': '#6b21a8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
