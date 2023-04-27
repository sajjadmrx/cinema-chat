import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"

import Login from "./pages/login"
import Signup from "./pages/signup"
import RoomsPage from "./pages/rooms/RoomsPage"
import Room from "./pages/single-room/Room"

import "./styles/globals.css"

export const routes = [
  { path: "/", element: <div>home page</div> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/rooms", element: <RoomsPage /> },
  { path: "/rooms/:id", element: <Room /> },
]

const router = createBrowserRouter(routes)

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
