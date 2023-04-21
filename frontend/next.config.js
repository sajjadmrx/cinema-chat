/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    additionalData: `@import "src/styles/theme.scss";`,
  },
  env: {
    API_URL: "http://193.36.85.124:4000",
  },
}

module.exports = nextConfig
