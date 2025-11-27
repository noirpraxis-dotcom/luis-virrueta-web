/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Outfit', 'system-ui', 'sans-serif'],
        'mono': ['Space Grotesk', 'monospace'],
        'body': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        // Ainimation Palette - Psicología × Diseño × IA
        'neural': {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d7ff',
          300: '#a4baff',
          400: '#8494ff',
          500: '#6366f1', // Primary - Neurociencia/IA
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        'psych': {
          50: '#fdf4ff',
          100: '#fae8ff',
          500: '#d946ef', // Psychology accent
          600: '#c026d3',
        },
        'design': {
          50: '#fff7ed',
          500: '#f59e0b', // Design/Creativity
          600: '#d97706',
        },
      },
      spacing: {
        '40': '10rem',
      },
    },
  },
  plugins: [],
}
