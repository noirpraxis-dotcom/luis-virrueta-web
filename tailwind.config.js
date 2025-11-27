/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Playfair Display', 'Georgia', 'serif'],
        'sans': ['Outfit', 'system-ui', 'sans-serif'],
        'mono': ['Space Grotesk', 'Consolas', 'monospace'],
        'body': ['Outfit', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Ainimation Cinematic Palette - Premium Dark
        'purple': {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7', // Deep Purple - Psychology/Mind
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        },
        'fuchsia': {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef', // Vibrant Fuchsia - Emotion/Design
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
        },
        'cyan': {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4', // Aqua Cyan - Tech/AI
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        'emerald': {
          400: '#34d399',
          500: '#10b981', // Accent green
          600: '#059669',
        },
      },
      spacing: {
        '40': '10rem',
      },
    },
  },
  plugins: [],
}
