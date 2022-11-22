/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "JIT",
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
          "light": "#000000",
          "200": "",
          "300": "",
          "400": "",
          'main': "#00000",
          "600": "",
          "700": "",
          "800": "",
          "dark": "#000000"
        },
        secondary: {
          "light": "#000000",
          "200": "",
          "300": "",
          "400": "",
          'main': "#00000",
          "600": "",
          "700": "",
          "800": "",
          "dark": "#000000"
        },
      },

      fontFamily: {
        "body": ["Fira Sans Condensed", "Fira Sans", "sans-serif"],
        "heading": ["Rubik", "Ubuntu", "sans-serif"]
      }
    },
  },
  plugins: [],
}
