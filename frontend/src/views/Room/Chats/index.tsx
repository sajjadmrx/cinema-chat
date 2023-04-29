import React, { useEffect, useState } from "react"
import { IconComponent } from "../../../components/Shared"
import { AiOutlineUser } from "react-icons/ai"
import DropdownMenu from "./DropdownMenu"
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"
import useSocket from "../../../hooks/useSocket"

const CHATS = [
  { user: "Dedy Gunawan", content: "Hi, are we going on new year's holiday?" },
  {
    user: "Dedy Gunawan",
    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
  {
    user: "Dedy Gunawan",
    content:
      " Natus vero itaque atque eum assumenda a accusamus obcaecati incidunt mollitia? Deleniti in possimus necessitatibus iste officia assumenda eius ratione maiores voluptatum. ",
  },
  { user: "Dedy Gunawan", content: "Hi, are we going on new year's holiday?" },
  { user: "Dedy Gunawan", content: "Hi, are we going on new year's holiday?" },
  { user: "Dedy Gunawan", content: "Hi, are we going on new year's holiday?" },
  { user: "Dedy Gunawan", content: "Hi, are we going on new year's holiday?" },
]

interface Prop {
  setShowMembers: any
}

const ChatsComponent = (props: Prop) => {
  const [showPicker, setShowPicker] = useState(false)
  const [message, setMessage] = useState("")
  const socket = useSocket()

  const handleEmojiSelect = (emoji: any) => {
    setMessage((prevMessage) => prevMessage + emoji.native)
  }
  return (
    <section className="lg:border-l border-slate-100 border-2 w-11/12 sm:w-3/5 lg:w-80 px-6 py-5 h-full xl:w-96 m-auto">
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-5 border-b border-gray-100 pb-3">
          <h2 className="text-lg font-semibold">Chats</h2>
          <AiOutlineUser
            onClick={() => props.setShowMembers(true)}
            className="lg:hidden"
            size={24}
          />
        </div>
      </div>
      <div className="space-y-5 h-[calc(100%-129px)] overflow-y-auto">
        {CHATS.map((item, index) => (
          <div key={index} className="mr-2">
            <div className="flex">
              <img
                className="w-9 rounded-full border border-gray-200"
                src="https://xsgames.co/randomusers/avatar.php?g=pixel"
              />
              <div className="flex items-center justify-between w-full">
                <h4 className="ml-3 -mb-1.5">{item.user}</h4>
                <DropdownMenu />
              </div>
            </div>

            <div className="ml-12 text-sm bg-gray-100 px-4 py-2 rounded-tl-none rounded-2xl border">
              {item.content}
            </div>
          </div>
        ))}
      </div>
      <div className="w-full h-12 mt-5 border rounded-full overflow-hidden">
        <div className="relative w-full h-full" dir={"auto"}>
          <input
            type="text"
            placeholder="Your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="absolute top-0 left-0 rounded-full w-full h-full pl-4 text-sm"
            onClick={() => setShowPicker(false)}
          />
          <button
            onClick={() => setShowPicker(!showPicker)}
            className="absolute top-1/2 -translate-y-1/2 z-10 right-10"
          >
            <span role="img" aria-label="smiley-face">
              😀
            </span>
          </button>
          <button className="absolute top-1/2 -translate-y-1/2 z-10 right-4">
            <IconComponent name="send" size={22} />
          </button>
        </div>
        <div className="absolute" style={{ bottom: 83, right: 26 }} hidden={!showPicker}>
          <Picker data={data} onEmojiSelect={handleEmojiSelect} />
        </div>
      </div>
    </section>
  )
}

export default ChatsComponent
