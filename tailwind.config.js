/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wbm: {
          neon: '#00DF00',
          'neon-dim': '#009900',
          'neon-glow': 'rgba(0, 223, 0, 0.35)',
          dark: '#050705',
          black: '#000000',
          card: '#0c0f0c',
          'card-hover': '#131913',
          border: 'rgba(0, 223, 0, 0.25)',
          'border-active': '#00DF00',
          gray: {
            100: '#f3f4f6',
            200: '#e5e7eb',
            300: '#d1d5db',
            400: '#9ca3af',
            500: '#6b7280',
            600: '#4b5563',
            700: '#374151',
            800: '#1f2937',
            900: '#111827',
          }
        }
      },
      fontFamily: {
        sans: ['Poppins', 'Montserrat', 'system-ui', 'sans-serif'],
        heading: ['"TT Firs Neue"', 'Poppins', 'Montserrat', 'sans-serif'],
      },
      boxShadow: {
        'neon-sm': '0 0 10px rgba(0, 223, 0, 0.3)',
        'neon': '0 0 20px rgba(0, 223, 0, 0.4)',
        'neon-lg': '0 0 35px rgba(0, 223, 0, 0.55)',
        'card-glow': '0 8px 32px -4px rgba(0, 223, 0, 0.15)',
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: '0.8', filter: 'drop-shadow(0 0 8px rgba(0,223,0,0.4))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 16px rgba(0,223,0,0.7))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
