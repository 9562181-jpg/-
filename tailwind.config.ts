import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          pink: '#FFE5E5',
          blue: '#E5F3FF',
          yellow: '#FFF9E5',
          green: '#E5FFE5',
          purple: '#F3E5FF',
          orange: '#FFE5CC',
        },
      },
      backgroundImage: {
        'gradient-pastel': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-sunny': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'gradient-peach': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'gradient-mint': 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
        'gradient-lavender': 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;

