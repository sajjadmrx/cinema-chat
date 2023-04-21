import type { AppProps } from "next/app"
import { AuthProvider } from "@/context/Auth/AuthProvider"
import "@/styles/globals.css"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  )
}
