/** @type {import('tailwindcss').Config} */
const { nextui } = require("@nextui-org/react")
const { theme } = require("./src/styles/theme")

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [nextui(theme)],
}
