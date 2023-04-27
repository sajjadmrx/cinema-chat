import React from "react"
import Layout from "../components/Layout"
import Navbar from "../components/Layout/Navbar"
import Chats from "../views/Room/Chats"
import Members from "../views/Room/Members"

const Room = () => {
  return (
    <Layout>
      <Navbar />
      <section className="flex h-[calc(100vh-72px)]">
        <Members />
        <div className="flex-1 px-6 py-5">
          <div className="flex items-center border-b pb-5 border-b-gray-100">
            <img
              className="w-16 h-16 rounded-full border-[6px] border-gray-200"
              src="https://xsgames.co/randomusers/avatar.php?g=pixel"
            />
            <h4 className="ml-3 -mb-1.5 font-bold">Call of Duty: World War II</h4>
          </div>
          <div className="bg-gray-200 w-full h-96 rounded-2xl mt-6 grid place-items-center border border-gray-300">
            Video Player
          </div>
        </div>
        <Chats />
      </section>
    </Layout>
  )
}

export default Room
