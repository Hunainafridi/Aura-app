/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#121318',
          dim: '#121318',
          bright: '#38393f',
          lowest: '#06070A',
          low: '#10121a',
          container: '#151722',
          high: '#1c1f2e',
          highest: '#292a2f',
          border: 'rgba(255, 255, 255, 0.08)'
        },
        void: '#090A0F',
        card: '#13161F',
        purge: '#38BDF8', // Sky Blue
        timelock: '#818CF8', // Soft Indigo
        primary: {
          DEFAULT: '#adc6ff',
          container: '#4d8eff',
          dark: '#1E40AF',
          light: '#d8e2ff'
        },
        secondary: {
          DEFAULT: '#4cd7f6',
          bright: '#22d3ee',
          cyan: '#06b6d4',
          deep: '#03b5d3'
        },
        tertiary: {
          DEFAULT: '#b8c4ff',
          container: '#6d89fa'
        },
        typography: {
          primary: '#F8FAFC',
          secondary: 'rgba(248, 250, 252, 0.60)',
          tertiary: 'rgba(248, 250, 252, 0.38)'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -4px rgba(56, 189, 248, 0.35)',
        'glow-indigo': '0 0 25px -4px rgba(129, 140, 248, 0.35)',
        'glow-subtle': '0 0 40px -10px rgba(76, 215, 246, 0.15)',
        'glass-card': '0 12px 40px rgba(0, 0, 0, 0.5)',
        'inner-well': 'inset 0 2px 6px rgba(0, 0, 0, 0.4)'
      },
      borderRadius: {
        'squircle-sm': '0.75rem',
        'squircle': '1rem',
        'squircle-lg': '1.5rem',
        'squircle-xl': '2rem',
        'squircle-2xl': '3rem',
      },
      animation: {
        'float-slow': 'float 8s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'pulse-calm': 'pulseCalm 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'dissolve': 'dissolve 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'burst': 'burst 1.5s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        pulseCalm: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.02)' },
        },
        dissolve: {
          '0%': { filter: 'blur(0px)', opacity: '1', transform: 'translateY(0px) scale(1)' },
          '50%': { filter: 'blur(8px)', opacity: '0.5', transform: 'translateY(-8px) scale(0.98)' },
          '100%': { filter: 'blur(20px)', opacity: '0', transform: 'translateY(-24px) scale(0.92)' }
        },
        burst: {
          '0%': { opacity: '0', transform: 'scale(0.85)' },
          '30%': { opacity: '1', transform: 'scale(1.06)' },
          '70%': { opacity: '0.9', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(1.15)' }
        }
      }
    },
  },
  plugins: [],
}
