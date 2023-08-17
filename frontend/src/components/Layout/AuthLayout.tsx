import { User } from "@interfaces/schemas/User.interface"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { isAuthenticated } from "../../utils"
import Loading from "../Loading/index"

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

  return isLoading ? <Loading /> : <div className="max-h-screen bg-dark">{children}</div>
}

export default AuthLayout
