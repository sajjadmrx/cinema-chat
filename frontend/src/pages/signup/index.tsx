import React from "react"
import SignUpForm from "../../components/Forms/SignUpForm"
import AuthLayout from "../../components/Layout/AuthLayout"
import { IconComponent } from "../../components/Shared"
import styles from "./styles.module.css"

const SignUpPage = () => {
  return (
    <AuthLayout>
      <div className={styles.Wrapper}>
        <SignUpForm />
        <div className={styles.Right}>
          <div className="absolute w-full h-full transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center">
              <div
                // style={{ background: "#2136F7" }}
                className="w-24 h-24 bg-primary rounded-[40px] grid place-items-center"
              >
                <IconComponent name="mail" color="white" size={40} />
              </div>
              <h2 className="text-2xl font-bold text-white">Lorem ipsum dolor sit.</h2>
              <p className="w-1/2 text-white opacity-50">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium fugiat
                eaque, rerum tempora pariatur reiciendis? Atque animi ut quos ab!
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}

export default SignUpPage
