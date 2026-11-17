/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: '#F5F0E8',
          light: '#FCFAF6',
          dark: '#EAE2D6',
        },
        warmwhite: '#FCFAF6',
        burgundy: {
          DEFAULT: '#621F2A',
          dark: '#40151D',
          light: '#7D2B39',
        },
        wine: '#40151D',
        olive: {
          DEFAULT: '#596044',
          dark: '#434932',
          light: '#7E8C78',
        },
        eucalyptus: '#7E8C78',
        blush: {
          DEFAULT: '#D8B8AF',
          light: '#EAD7D1',
          dark: '#C19A8F',
        },
        graphite: {
          DEFAULT: '#292622',
          muted: '#5A554E',
          light: '#857F77',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'organic': '24px 8px 24px 8px',
        'arch': '140px 140px 12px 12px',
      },
      keyframes: {
        sway: {
          '0%, 100%': { transform: 'rotate(-1.5deg) translateY(0px)' },
          '50%': { transform: 'rotate(1.5deg) translateY(-4px)' },
        },
        drape: {
          '0%, 100%': { transform: 'translateX(0%) scaleY(1)' },
          '50%': { transform: 'translateX(1.5%) scaleY(1.02)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'sway-slow': 'sway 9s ease-in-out infinite',
        'drape-slow': 'drape 12s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards',
      }
    },
  },
  plugins: [],
}
