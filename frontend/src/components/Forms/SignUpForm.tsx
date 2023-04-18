import * as Yup from "yup"
import Link from "next/link"
import { useFormik } from "formik"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"

import * as authService from "@/services/auth.service"
import { Button, Icon, Input } from "../Shared"

let timer: any

const initialValues = {
  username: "",
  email: "",
  password: "",
}

const validationSchema = Yup.object({
  username: Yup.string().required("Please enter username"),
  email: Yup.string().email("Invalid email address").required("Please enter email"),
  password: Yup.string()
    .required("Please enter password")
    .min(8, "Password must be at least 8 characters long"),
})

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  const onSubmit = async (values: any) => {
    setIsLoading(true)
    toast.loading("Registering")

    const res = await authService.signUpUser(values)

    if (res.success) {
      setIsLoading(false)
      localStorage.setItem("token", res.token)
      toast.dismiss()
      toast.success("Your account has been successfully created")
      timer = setInterval(() => router.push("/"), 2000)
    } else {
      toast.dismiss()
      setIsLoading(false)

      console.log(res.error)
    }
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  })

  useEffect(() => {
    return () => {
      clearInterval(timer)
    }
  }, [])

  return (
    <>
      <div className="p-16 pb-32 w-full lg:w-1/3 rounded-l-2xl bg-white z-10 lg:max-w-xl text-center grid place-items-center">
        <div className="w-full">
          <h1 className="mb-2 text-2xl font-bold">
            Sigup in <span className="text-primaryHover">Cinema Chat</span>
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Welcome back! Please enter your details
          </p>
          <form className="flex flex-col gap-2" onSubmit={formik.handleSubmit}>
            <Input
              name="username"
              type="text"
              formik={formik}
              placeholder="Fullname"
              icon={
                <Icon
                  name="user"
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                />
              }
            />
            <Input
              name="email"
              type="email"
              formik={formik}
              placeholder="Email"
              icon={
                <Icon
                  name="mail"
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                />
              }
            />
            <Input
              name="password"
              type="password"
              formik={formik}
              placeholder="Password"
              icon={
                <Icon
                  name="lock"
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                />
              }
            />

            <Button type="submit" variant="primary" loading={isLoading} className="mt-5">
              Signup
            </Button>

            <p className="mt-4 mb-2 text-sm text-left">
              Do you have an account before?{" "}
              <Link href="/login" className="text-primary hover:text-primaryActive">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>

      <Toaster position="top-right" />
    </>
  )
}

export default SignUp
