/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#2563EB',
          dark: '#1D4ED8',
          light: '#EFF6FF',
        },
        page: '#F3F3F3',
        border: '#D9DDE3',
        ink: '#252525',
        sub: '#6B7280',
        header: '#6B747D',
      },
      fontFamily: {
        sans: ['Inter', 'Arial', 'sans-serif'],
      },
      maxWidth: {
        content: '1220px',
      },
    },
  },
  plugins: [],
};
