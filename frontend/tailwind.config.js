const colors = require("tailwindcss/colors")

/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      ...colors,
      primary: "#3346F8",
      primaryHover: "#2136F7",
      primaryActive: "#081CDE",
      secondary: "#e60000",
      secondaryHover: "#d60000",
      secondaryActive: "#cc0000"
    },
    fontFamily: {
      sans: ["shabnam", "rancho", "poppins"]
    }
  },
  plugins: [],
}
