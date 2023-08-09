/* eslint-disable @typescript-eslint/ban-ts-comment */
// const colors = require("tailwindcss/colors")
//
// /** @type {import('tailwindcss').Config} */
//
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//     "node_modules/daisyui/dist/**/*.js",
//     "node_modules/react-daisyui/dist/**/*.js",
//   ],
//   theme: {
//     colors: {
//       ...colors,
//       primary: "#3346F8",
//       primaryHover: "#2136F7",
//       primaryActive: "#081CDE",
//       secondary: "#e60000",
//       secondaryHover: "#d60000",
//       secondaryActive: "#cc0000",
//     },
//     fontFamily: {
//       sans: ["shabnam", "rancho", "poppins"],
//     },
//   },
//   plugins: [require("daisyui")],
// }
//
// @ts-ignore
const withMT = require("@material-tailwind/react/utils/withMT")
module.exports = withMT({
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
    "node_modules/daisyui/dist/**/*.js",
    "node_modules/react-daisyui/dist/**/*.js",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {},
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
  daisyui: {
    styled: true,
    base: true,
    utils: true,
    logs: false,
    rtl: false,

    themes: ["light", "dark"],
  },

  plugins: [require("daisyui")],
})
