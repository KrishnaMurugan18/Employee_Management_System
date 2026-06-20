/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        navy: {
          50: '#eef1f6',
          100: '#d4dce8',
          200: '#a9bad1',
          300: '#7e97ba',
          400: '#5775a3',
          500: '#3c5780',  // base brand
          600: '#2e436b',
          700: '#243556',
          800: '#1a2740',
          900: '#0f1829',
          950: '#080d17',
        },
        amber: {
          50: '#fdf6e8',
          100: '#faecc7',
          200: '#f3d685',
          300: '#ecc04e',
          400: '#e8a33d',  // accent
          500: '#d68a23',
          600: '#b06d18',
        },
        success: '#2f9e68',
        danger: '#d64545',
        surface: {
          light: '#f7f8fa',
          dark: '#11161f',
        },
        card: {
          light: '#ffffff',
          dark: '#1a212e',
        },
      },
      boxShadow: {
        soft: '0 2px 12px -2px rgba(15, 24, 41, 0.08)',
        card: '0 4px 24px -4px rgba(15, 24, 41, 0.10)',
      },
      borderRadius: {
        xl2: '1.1rem',
      },
    },
  },
  plugins: [],
}
