import React from "react"

import AuthLayout from "../../components/Layout/AuthLayout"
import { IconComponent } from "../../components/Shared"
import LoginForm from "../../components/Forms/LoginForm"

// @ts-ignore
import styles from "./styles.module.css"

const SignUpPage = () => {
  return (
    <AuthLayout>
      <div className={styles.Wrapper}>
        <LoginForm />
        <div className={styles.Right}>
          <div className="absolute w-full h-full transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
            <div className="flex flex-col items-center justify-center text-center gap-4 absolute inset-0">
              <div
                style={{ background: "#21A73F" }}
                className="w-24 h-24 rounded-[40px] grid place-items-center"
              >
                <IconComponent name="user" color="white" size={40} />
              </div>
              <h2 className="text-white text-2xl font-bold">
                Lorem ipsum dolor sit amet.
              </h2>
              <p className="text-white opacity-50 w-1/2">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Reprehenderit
                excepturi sit provident optio pariatur aperiam ipsum error neque suscipit
                similique!
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}

export default SignUpPage
