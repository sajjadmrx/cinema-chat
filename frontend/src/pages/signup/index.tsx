import Layout from "@/components/Layout"
import SignUpForm from "@/components/Forms/SignUpForm"

import styles from "./styles.module.css"
import { Icon } from "@/components/Shared"

const SignUpPage = () => {
  return (
    <Layout>
      <div className={styles.Wrapper}>
        <SignUpForm />
        <div className={styles.Right}>
          <div className="absolute w-full h-full transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
            <div className="flex flex-col items-center justify-center text-center gap-4 absolute inset-0">
              <div
                style={{ background: "#2136F7" }}
                className="w-24 h-24 rounded-[40px] grid place-items-center"
              >
                <Icon name="mail" color="white" size={40} />
              </div>
              <h2 className="text-white text-2xl font-bold">Lorem ipsum dolor sit.</h2>
              <p className="text-white opacity-50 w-1/2">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium fugiat
                eaque, rerum tempora pariatur reiciendis? Atque animi ut quos ab!
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default SignUpPage
