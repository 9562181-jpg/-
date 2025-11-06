/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef3f2',
          100: '#fee5e2',
          200: '#fecfca',
          300: '#fdaea5',
          400: '#fb7e71',
          500: '#f25542',
          600: '#e03525',
          700: '#bc281b',
          800: '#9c251b',
          900: '#81261e',
        },
        pastel: {
          pink: '#FFE5EC',
          purple: '#E5DEFF',
          blue: '#D4F1F4',
          green: '#D4F4DD',
          yellow: '#FFF5D4',
          peach: '#FFE4D6',
          lavender: '#E8DEF8',
          mint: '#C7EFCF',
          sky: '#C9E4FF',
          coral: '#FFD4D4',
        },
      },
      backgroundImage: {
        'gradient-pastel': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-sunny': 'linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)',
        'gradient-peach': 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        'gradient-mint': 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        'gradient-lavender': 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}

