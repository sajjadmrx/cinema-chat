import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { isAuthenticated } from "../../utils"

type Props = { children: React.ReactNode }

const AuthLayout = ({ children }: Props) => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await isAuthenticated()
      console.log(isAuth)
      if (!isAuth) setIsLoading(false)
      else navigate("/rooms")
    }
    checkAuth()
  }, [navigate])

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <div className="max-h-screen">{children}</div>
  )
}

export default AuthLayout
