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
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
      },

      /* 🔥 AJOUT ICI : KEYFRAMES + ANIMATE pour effet Liquid Glass */
      keyframes: {
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(8px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },

        /* 💧 Animation Morphing du container Liquid Glass */
        morph: {
          '0%, 100%': { borderRadius: '1.5rem' },
          '25%': { borderRadius: '2rem 1rem 2rem 1rem' },
          '50%': { borderRadius: '1rem 2rem 1rem 2rem' },
          '75%': { borderRadius: '2rem 2rem 1.5rem 1rem' },
        },
      },

      animation: {
        'fade-in-up': 'fadeInUp 0.35s ease-out',

        /* 💧 Animation Liquid Glass */
        morph: 'morph 10s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;