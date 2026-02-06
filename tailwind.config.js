/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FAF8F3',
        warmGray: {
          50: '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E5E4',
          300: '#D6D3D1',
          400: '#A8A29E',
          500: '#78716C',
          600: '#57534E',
          700: '#44403C',
          800: '#292524',
          900: '#1C1917',
        },
        sage: {
          50: '#F6F7F6',
          100: '#E3E8E3',
          200: '#C7D1C7',
          300: '#A1B0A1',
          400: '#7A8E7A',
          500: '#5C715C',
          600: '#495949',
          700: '#3A483A',
          800: '#2D372D',
          900: '#1F271F',
        },
        terracotta: {
          50: '#FDF6F4',
          100: '#F9E8E3',
          200: '#F3D1C7',
          300: '#E8AE9D',
          400: '#DC8B73',
          500: '#C96846',
          600: '#A94F35',
          700: '#8A3F2A',
          800: '#6D3222',
          900: '#4D231A',
        }
      },
      fontFamily: {
        sans: ['Inter Variable', 'system-ui', 'sans-serif'],
        display: ['Crimson Pro', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace']
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
