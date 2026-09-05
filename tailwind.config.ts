import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#030405',
          900: '#06070a',
          850: '#0a0c10',
          800: '#12151c',
          700: '#1e222e',
          600: '#2d3345',
        },
        zen: {
          cyan: '#00f2fe',
          violet: '#a78bfa',
          rose: '#f43f5e',
          emerald: '#10b981',
          gold: '#f59e0b',
          blue: '#3b82f6',
          purple: '#7877c6',
        },
      },
      boxShadow: {
        'glass-glow': '0 0 35px -5px rgba(255, 255, 255, 0.05)',
        'card-glow': '0 0 30px -5px rgba(255, 255, 255, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'cyan-glow': '0 0 30px -5px rgba(0, 242, 254, 0.25)',
        'violet-glow': '0 0 35px -5px rgba(167, 139, 250, 0.3)',
        'emerald-glow': '0 0 30px -5px rgba(16, 185, 129, 0.25)',
        'rose-glow': '0 0 30px -5px rgba(244, 63, 94, 0.25)',
        'gold-glow': '0 0 30px -5px rgba(245, 158, 11, 0.25)',
        'founder-glow': '0 0 45px -5px rgba(244, 63, 94, 0.25)',
        'inner-glow': 'inset 0 0 60px rgba(255,255,255,0.03)',
      },
      fontFamily: {
        display: ['"Clash Display"', 'var(--font-outfit)', 'var(--font-space)', 'sans-serif'],
        outfit: ['var(--font-outfit)', 'sans-serif'],
        space: ['var(--font-space)', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['var(--font-inter)', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'aurora-1': 'aurora-drift 20s ease-in-out infinite',
        'aurora-2': 'aurora-drift-reverse 25s ease-in-out infinite',
        'aurora-3': 'aurora-drift 30s ease-in-out infinite',
        'gradient-rotate': 'gradient-rotate 6s linear infinite',
        'breathe': 'breathe 4s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in-scale': 'fade-in-scale 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'gradient-flow': 'gradient-flow 6s ease infinite',
        'slide-in-left': 'slide-in-left 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-right': 'slide-in-right 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'aurora-drift': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '25%': { transform: 'translate(30px, -50px) scale(1.05)' },
          '50%': { transform: 'translate(-20px, 20px) scale(0.95)' },
          '75%': { transform: 'translate(50px, 30px) scale(1.02)' },
        },
        'aurora-drift-reverse': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '25%': { transform: 'translate(-40px, 30px) scale(0.97)' },
          '50%': { transform: 'translate(25px, -40px) scale(1.04)' },
          '75%': { transform: 'translate(-30px, -20px) scale(1.01)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.06)', opacity: '0.9' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-scale': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px -4px rgba(255,255,255,0.15)' },
          '50%': { boxShadow: '0 0 30px -2px rgba(255,255,255,0.25)' },
        },
        'gradient-flow': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'slide-in-left': {
          from: { opacity: '0', transform: 'translateX(-30px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-right': {
          from: { opacity: '0', transform: 'translateX(30px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
      },
      backdropBlur: {
        '3xl': '64px',
        '4xl': '80px',
      },
    },
  },
  plugins: [],
};

export default config;