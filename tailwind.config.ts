import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: '#6366f1',
        'bg-base': '#080c14',
        'bg-surface': '#0d1525',
        'bg-card': '#111a2e',
      },
    },
  },
  plugins: [],
}
export default config