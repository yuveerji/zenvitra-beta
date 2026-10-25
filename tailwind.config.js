/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        display: ['"Clash Display"', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
        playfair: ['var(--font-playfair)', 'serif'],
        mono: ['var(--font-mono)', 'monospace'],
        outfit: ['var(--font-outfit)', 'sans-serif'],
        space: ['var(--font-space)', 'sans-serif'],
        jakarta: ['var(--font-plus-jakarta)', 'sans-serif'],
        syne: ['Syne', 'sans-serif'],
        cinzel: ['"Cinzel Decorative"', 'serif'],
        bebas: ['"Bebas Neue"', 'sans-serif'],
        orbitron: ['Orbitron', 'sans-serif'],
      },
      colors: {
        obsidian: {
          DEFAULT: '#08090B',
          950: '#020203',
          900: '#050608',
          800: '#08090c',
        },
        dias: {
          obsidian: '#08090B',
          charcoal: '#111318',
          surface: '#181B21',
          border: '#232731',
          gold: '#C5A46D',
          goldLight: '#E6D1A5',
          goldDark: '#9A7E4F',
          text: '#F4F2ED',
          muted: '#9A9DA5',
          emerald: '#1C3829',
          crimson: '#822424',
          amber: '#B87A24',
        },
      },
      animation: {
        'shimmer': 'shimmer 2.5s infinite linear',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-drift': 'glowDrift 10s ease-in-out infinite alternate',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glowDrift: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '50%': { transform: 'translate(25px, -20px) scale(1.08)' },
          '100%': { transform: 'translate(-20px, 15px) scale(0.96)' },
        },
      },
    },
  },
  plugins: [],
};