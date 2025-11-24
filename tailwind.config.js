/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'elegant': ['Cormorant Garamond', 'serif'],
        'modern': ['Montserrat', 'sans-serif'],
        'gotham': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        'elegant-white': '#F5F5F5',
        'elegant-gray': '#E8E8E8',
      },
      spacing: {
        '40': '10rem', // 160px para el header más elegante
      },
    },
  },
  plugins: [],
}
