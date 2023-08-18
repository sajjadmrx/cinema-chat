import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { AuthProvider } from "./context/auth/AuthProvider"
import Login from "./pages/login"
import NotFoundPage from "./pages/notFound"
import RoomsPage from "./pages/rooms/RoomsPage"
import Signup from "./pages/signup"
import { RoomPage } from "./pages/single-room/Room"
import "./styles/globals.css"

export const routes = [
  // { path: "/", element: <LandingPage /> },
  { path: "/", element: <RoomsPage /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/rooms", element: <RoomsPage /> },
  { path: "/rooms/:id", element: <RoomPage key={1} /> },
  { path: "*", element: <NotFoundPage /> },
  // <Route path="*" element={<PageNotFound />} />,
]

const router = createBrowserRouter(routes)

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)
