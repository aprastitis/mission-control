import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      boxShadow: {
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        '3xl': '0 35px 60px -12px rgba(0, 0, 0, 0.25)',
        // Neumorphism shadows
        'neu-convex': '9px 9px 16px #d1d9e6, -9px -9px 16px #ffffff',
        'neu-convex-dark': '9px 9px 16px #1a1a1a, -9px -9px 16px #2a2a2a',
        'neu-inset': 'inset 9px 9px 16px #d1d9e6, inset -9px -9px 16px #ffffff',
        'neu-inset-dark': 'inset 9px 9px 16px #1a1a1a, inset -9px -9px 16px #2a2a2a',
        'neu-pressed': 'inset 6px 6px 10px #d1d9e6, inset -6px -6px 10px #ffffff',
        'neu-pressed-dark': 'inset 6px 6px 10px #1a1a1a, inset -6px -6px 10px #2a2a2a',
      },
      borderRadius: {
        '3xl': '2.5rem',
      },
      backgroundImage: {
        'neu-glass': 'linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
        'neu-glass-dark': 'linear-gradient(145deg, rgba(0,0,0,0.1), rgba(0,0,0,0.05))',
      },
      fontSize: {
        'responsive-xs': ['clamp(0.75rem, 0.7vw, 0.875rem)', '1rem'],
        'responsive-sm': ['clamp(0.875rem, 0.8vw, 1rem)', '1.25rem'],
        'responsive-base': ['clamp(1rem, 1vw, 1.125rem)', '1.5rem'],
        'responsive-lg': ['clamp(1.125rem, 1.2vw, 1.25rem)', '1.75rem'],
        'responsive-xl': ['clamp(1.25rem, 1.4vw, 1.5rem)', '2rem'],
        'responsive-2xl': ['clamp(1.5rem, 1.6vw, 2rem)', '2.5rem'],
      }
    }
  },
  plugins: [],
  future: {
    hoverOnlyWhenSupported: true,
  }
} satisfies Config