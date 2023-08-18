import { useFormik } from "formik"
import React, { useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import { Link, useNavigate } from "react-router-dom"
import * as Yup from "yup"

import { loginService } from "../../services/auth.service"
import { errorHandling } from "../../shared/lib/error-handling"
import { ButtonComponent, IconComponent, InputComponent } from "../Shared"

type loginUser = { username: string; password: string }

const initialValues = {
  username: "",
  password: "",
}

const validationSchema = Yup.object({
  username: Yup.string().required("Please enter username"),
  password: Yup.string()
    .required("Please enter password")
    .min(8, "Password must be at least 8 characters long"),
})

let timer: any

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async (values: loginUser) => {
    setIsLoading(true)
    try {
      const res = await loginService(values)
      localStorage.setItem("token", res.data)
      toast.success("Login was successful!")
      timer = setInterval(() => navigate("/rooms"), 2000)
    } catch (e) {
      const message = errorHandling(e)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    return () => {
      clearInterval(timer)
    }
  }, [])

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  })

  return (
    <>
      <div className="z-10 grid items-center justify-center w-full p-16 pb-32 text-center bg-white shadow-2xl shadow-primary lg:w-1/3 rounded-2xl lg:rounded-r-none lg:max-w-xl place-items-center">
        <div className="w-full">
          <h1 className="mb-2 text-2xl font-bold">
            Log in <span className="text-primaryHover">Cinema Chat</span>
          </h1>
          <p className="mb-8 text-sm text-gray-500">
            Welcome back! Please enter your details
          </p>
          <form className="flex flex-col gap-2" onSubmit={formik.handleSubmit}>
            <InputComponent
              name="username"
              type="text"
              formik={formik}
              placeholder="username"
              icon={
                <IconComponent
                  name="user"
                  size={20}
                  className="absolute transform -translate-y-1/2 left-3 top-1/2"
                />
              }
            />
            <InputComponent
              name="password"
              type="password"
              formik={formik}
              placeholder="Password"
              icon={
                <IconComponent
                  name="lock"
                  size={20}
                  className="absolute transform -translate-y-1/2 left-3 top-1/2"
                />
              }
            />

            <ButtonComponent
              type="submit"
              variant="primary"
              className="mt-5 text-center"
              loading={isLoading}
            >
              Login
            </ButtonComponent>

            <p className="mt-4 mb-2 text-sm text-center">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-center text-primary hover:text-primaryActive"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>

      <Toaster position="top-right" />
    </>
  )
}

export default LoginForm
