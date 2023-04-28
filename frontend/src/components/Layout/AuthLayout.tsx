import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { isAuthenticated } from "../../utils"
import { User } from "@interfaces/schemas/User.interface"

type Props = { children: React.ReactNode }

const AuthLayout = ({ children }: Props) => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const user: User | null = await isAuthenticated()
      if (!user) setIsLoading(false)
      else navigate("/rooms")
    }
    return () => {
      checkAuth()
    }
  }, [navigate])

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <div className="max-h-screen">{children}</div>
  )
}

export default AuthLayout
