import { useRouter } from "next/router"
import { useSession } from "next-auth/react"

import Layout from "@/components/Layout"
import { Icon } from "@/components/Shared"
import LoginForm from "@/components/Forms/LoginForm"

import styles from "./styles.module.css"

const SignUpPage = () => {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (session?.user?.data) router.push("/rooms")
  if (status === "loading") return <div>Loading...</div>

  return (
    <Layout>
      <div className={styles.Wrapper}>
        <LoginForm />
        <div className={styles.Right}>
          <div className="absolute w-full h-full transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
            <div className="flex flex-col items-center justify-center text-center gap-4 absolute inset-0">
              <div
                style={{ background: "#21A73F" }}
                className="w-24 h-24 rounded-[40px] grid place-items-center"
              >
                <Icon name="user" color="white" size={40} />
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
    </Layout>
  )
}

export default SignUpPage
