const { nextui } = require("@nextui-org/react")
const withMT = require("@material-tailwind/react/utils/withMT")
module.exports = withMT({
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#B3005E",
        secondary: "#E90064",
        light: "#FF5F9E",
        dark: "#001731",
        // dark: "#ffff",
      },
      keyframes: {
        fadeIn: {
          from: {
            opacity: "0",
          },
          to: {
            opacity: "1",
          },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.3s ease-in-out",
      },
      fontFamily: {
        sans: ["shabnam", "rancho", "poppins"],
      },
    },
  },
  plugins: [nextui()],
})
