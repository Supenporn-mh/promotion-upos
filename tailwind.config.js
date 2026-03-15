/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: 'oklch(75.3% .214 259.815)',
          main: 'oklch(62.3% .214 259.815)',
          dark: 'oklch(52.3% .214 259.815)'
        },
        danger: {
          light: '#ef4444',
          main: '#dc2626',
          dark: '#b91c1c'
        },
        success: {
          main: '#10b981'
        }
      },
      fontFamily: {
        sans: ['"IBM Plex Sans Thai"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
