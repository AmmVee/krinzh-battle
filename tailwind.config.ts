// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        krinzh: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899', // основной кринж-розовый
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
        ded: '#0f0f0f', // почти чёрный фон
        mental: '#10b981', // зелёный для менталки
        cring: '#ef4444', // красный для кринжа
      },
      fontFamily: {
        krinzh: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'krinzh-gradient': 'linear-gradient(to bottom right, #ec4899, #a855f7, #7c3aed)',
        'ded-gradient': 'linear-gradient(to bottom, #0f0f0f, #1a1a1a)',
      },
      animation: {
        'pulse-kri': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
        'ded-inside': 'pulse 2s infinite',
      },
    },
  },
  plugins: [],
}

export default config