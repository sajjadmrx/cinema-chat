import React, { useContext, useEffect, useRef, useState } from "react"
import { IconComponent } from "../../../components/Shared"
import { AiOutlineUser } from "react-icons/ai"
import DropdownMenu from "./DropdownMenu"
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"
import { Message } from "@interfaces/schemas/message.interface"
import { Socket } from "socket.io-client"
import { useAuth } from "../../../context/auth/AuthProvider"
import { useParams } from "react-router-dom"
import { BsEmojiSmile } from "react-icons/bs"
import { fetchMessages } from "../../../services/message.service"
import { socketContext, SocketContext } from "../../../context/socket/socketContext"
import { socket } from "../../../hooks/useSocket"

interface Prop {
  setShowMembers: any
}
const messagesStore = new Map<string, Message>()

const ChatsComponent = ({ setShowMembers }: Prop) => {
  const {} = useContext<SocketContext>(socketContext)
  const [showPicker, setShowPicker] = useState(false)
  const [message, setMessage] = useState<string>("")
  const [messages, setMessages] = useState<Message[]>([])
  const { user } = useAuth()
  const params = useParams()
  let scrollRef = useRef<any>()

  useEffect(() => {
    socket.on("CREATE_MESSAGE", (message: Message) => {
      if (message.roomId == Number(params.id)) {
        setMessages((prevMessages) => [...prevMessages, message])
        messagesStore.set(message.id, message)
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight // todo bug
      }
    })
    return () => {
      socket.off("CREATE_MESSAGE")
    }
  }, [socket])

  useEffect(() => {
    fetchMessages(Number(params.id), 1).then((resp) => setMessages(resp.data.reverse()))
  }, [])

  const handleEmojiSelect = (emoji: any) => {
    setMessage((prevMessage) => prevMessage + emoji.native)
  }

  const sendMsg = () => {
    socket.emit("CREATE_MESSAGE", {
      content: message,
      replyId: null,
      roomId: Number(params.id),
    })
    setMessage("")
  }

  return (
    <section className="lg:border-l border-slate-100 border-2 w-11/12 sm:w-3/5 lg:w-80 px-6 py-5 h-full xl:w-96 m-auto">
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-5 border-b border-gray-100 pb-3">
          <h2 className="text-lg font-semibold">Chats</h2>
          <AiOutlineUser
            onClick={() => setShowMembers(true)}
            className="lg:hidden"
            size={24}
          />
        </div>
      </div>
      {/* @ts-ignore*/}
      <div className="space-y-5 h-[calc(100%-129px)] overflow-y-auto" ref={scrollRef}>
        {messages.map((item, index) => (
          <div key={index} className="mr-2">
            <div className="flex">
              <img
                className="w-9 rounded-full border border-gray-200"
                src="/assets/images/avatar.jpg"
                alt={"avatar"}
              />
              <div className="flex items-center justify-between w-full">
                <h4 className="ml-3 ">
                  {item.authorId == user?.userId && "[you]"}{" "}
                  {item.author?.nickname || item.author.user.username}
                </h4>
                <DropdownMenu />
              </div>
            </div>

            <div
              className="ml-12 text-sm bg-gray-100 px-4 py-2 rounded-tl-none rounded-2xl border"
              style={{ wordBreak: "break-word" }}
            >
              {item.content}
              <div className="text-xs text-gray-500 mt-1">
                {new Date(item.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="w-full h-12 mt-5 border rounded-full overflow-hidden">
        <div className="relative w-full h-full" dir={"auto"}>
          <textarea
            placeholder="Your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="absolute top-3 left-0 rounded-full w-full h-full pl-4 text-sm  focus:outline-none focus:border-indigo-500"
            onClick={() => setShowPicker(false)}
          />
          <button
            onClick={() => setShowPicker(!showPicker)}
            className="absolute top-1/2 -translate-y-1/2 z-10 right-10"
          >
            <span role="img" aria-label="smiley-face">
              <BsEmojiSmile />
            </span>
          </button>
          <button
            className="absolute top-1/2 -translate-y-1/2 z-10 right-2"
            onClick={sendMsg}
          >
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
