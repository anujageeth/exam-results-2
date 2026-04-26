/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ceylon-maroon': {
          DEFAULT: '#5F0A0C',
          50: '#FDF2F2',
          100: '#F9E0E0',
          200: '#F0BABA',
          300: '#E08A8B',
          400: '#C94E50',
          500: '#9E1F22',
          600: '#7A1214',
          700: '#5F0A0C',
          800: '#470709',
          900: '#330506',
        },
        'ceylon-gold': {
          DEFAULT: '#F5BA1D',
          50: '#FEF9E7',
          100: '#FDF0C3',
          200: '#FBDF7F',
          300: '#F8CE42',
          400: '#F5BA1D',
          500: '#D99E0B',
          600: '#B07F09',
          700: '#876107',
          800: '#5E4305',
          900: '#352603',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 12px 0 rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.06)',
        'elevated': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};
