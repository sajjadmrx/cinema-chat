import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/auth/AuthProvider"
import { isAuthenticated } from "../../utils"
import Loading from "../Loading/index"

export default function Layout({ children }: any) {
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()
  const { handleSetUser } = useAuth()

  useEffect(() => {
    const checkAuth = async () => {
      const user = await isAuthenticated()
      if (!user) {
        navigate("/login")
      } else {
        handleSetUser(user)
        setLoading(false)
      }
    }
    checkAuth()
  }, [navigate])

  return loading ? (
    <Loading />
  ) : (
    <section className="min-h-screen bg-dark">
      <section>{children}</section>
    </section>
  )
}
