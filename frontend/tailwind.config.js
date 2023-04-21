const colors = require("tailwindcss/colors")

module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
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
