/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    colors: {
      white: "#FFFFFF",
      black: "#000000",
      blue: "#0158A1",
      light_blue: "#3295E8",
      gray: "#C6C6C6",
    },
    fontFamily: {
      montsarret: ['Montserrat', 'sans-serif'],
    },
    fontWeight: {
      'montserrat-300': 300,
      'montserrat-400': 400,
      'montserrat-500': 500,
      'montserrat-600': 600,
      'montserrat-700': 700,
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none', /* Internet Explorer 10+ */
          'scrollbar-width': 'none', /* Firefox */
          '&::-webkit-scrollbar': {
            display: 'none', /* Safari and Chrome */
          },
        },
      });
    },
  ],
}