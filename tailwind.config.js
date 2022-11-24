/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'media', // or'media' or 'class'
  content: [
    "./Public/*.html",
    "./Public/*.css",
    "./Public/*.js"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#d1d1d1",
          200: "#a3a3a3",
          300: "#757575",
          400: "#474747",
          500: "#191919",
          600: "#141414",
          700: "#0f0f0f",
          800: "#0a0a0a",
          900: "#050505"
        },
        secondary: {
          100: "#fbfbfb",
          200: "#f7f7f7",
          300: "#f4f4f4",
          400: "#f0f0f0",
          500: "#ececec",
          600: "#bdbdbd",
          700: "#8e8e8e",
          800: "#5e5e5e",
          900: "#2f2f2f"
        },
        tertiary: {
          100: "#f6cdcd",
          200: "#ec9c9c",
          300: "#e36a6a",
          400: "#d93939",
          500: "#d00707",
          600: "#a60606",
          700: "#7d0404",
          800: "#530303",
          900: "#2a0101"
        },
        positive: "#03CEA4",
        negative: "#760505",
      },

      fontFamily: {
        "body": ["Fira Sans Condensed", "Fira Sans", "sans-serif"],
        "heading": ["Rubik", "Ubuntu", "sans-serif"]
      }
    },
  },
  plugins: [],
}