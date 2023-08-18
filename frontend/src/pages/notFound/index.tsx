import React from "react"
import { Link } from "react-router-dom"
import IMG from "../../../public/assets/images/404.svg"
import AuthLayout from "../../components/Layout/AuthLayout"
const NotFoundPage = () => {
  return (
    <AuthLayout>
      <div className="flex flex-col items-center justify-center w-full h-screen gap-10 bg-dark">
        <img src={IMG} alt="404" className="h-96 w-96" />
        <Link to="/" className="text-2xl font-semibold text-white">
          CLCIK FOR GO TO <span className="text-primary">HOME PAGE</span>
        </Link>
      </div>
    </AuthLayout>
  )
}

export default NotFoundPage
