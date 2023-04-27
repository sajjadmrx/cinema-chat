import * as Yup from "yup"
import React, { useState, useEffect } from "react"
import { useFormik } from "formik"
import { Link, useNavigate } from "react-router-dom"
import toast, { Toaster } from "react-hot-toast"

import * as authService from "../../services/auth.service"
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
    const res = await authService.login(values)
    if (res.success) {
      localStorage.setItem("token", res.data)
      toast.success("Login was successful!")
      timer = setInterval(() => navigate("/rooms"), 2000)
    } else {
      toast.dismiss()

      const invalidUesrnamePassword =
        res.error?.response?.data?.message === "INVALID_USERNAME_PASSWORD"
      const serverError = res.error.response.data.message === "SERVER_ERROR"

      if (invalidUesrnamePassword) toast.error("Invalid username or password")
      if (serverError) toast.error("There is a problem on the server side")
    }
    setIsLoading(false)
    console.log(res)
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
      <div className="p-16 pb-32 w-full lg:w-1/3 rounded-l-2xl bg-white z-10 lg:max-w-xl text-center grid place-items-center">
        <div className="w-full">
          <h1 className="mb-2 text-2xl font-bold">
            Log in <span className="text-primaryHover">Cinema Chat</span>
          </h1>
          <p className="text-sm text-gray-500 mb-8">
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
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
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
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                />
              }
            />

            <ButtonComponent
              type="submit"
              variant="primary"
              className="mt-5"
              loading={isLoading}
            >
              Login
            </ButtonComponent>

            <p className="mt-4 mb-2 text-sm text-left">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:text-primaryActive">
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
