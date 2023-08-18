import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"
import { Message } from "@interfaces/schemas/message.interface"
import React, { useContext, useEffect, useRef, useState } from "react"
import { AiOutlineUser } from "react-icons/ai"
import { BsEmojiSmile, BsFillChatLeftDotsFill } from "react-icons/bs"
import { IoSendSharp } from "react-icons/io5"
import { useParams } from "react-router-dom"
import { useAuth } from "../../../context/auth/AuthProvider"
import { SocketContext, socketContext } from "../../../context/socket/socketContext"
import { socket } from "../../../hooks/useSocket"
import { fetchMessages } from "../../../services/message.service"
// import ChatAside from "./ChatAside"
import ChatAside from "./ChatAside"
import DropdownMenu from "./DropdownMenu"
interface Prop {
  setShowMembers: any
}
const messagesStore = new Map<string, Message>()

const ChatsComponent = ({ setShowMembers }: Prop) => {
  // eslint-disable-next-line no-empty-pattern
  const {} = useContext<SocketContext>(socketContext)
  const [showPicker, setShowPicker] = useState(false)
  const [message, setMessage] = useState<string>("")
  const [messages, setMessages] = useState<Message[]>([])
  const { user } = useAuth()
  const params = useParams()
  const scrollRef = useRef<any>()
  const [chatSidebar, setchatSide] = useState<boolean>(false)
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
    <>
      <button onClick={() => setchatSide(true)}>
        <BsFillChatLeftDotsFill className="text-2xl text-white lg:hidden" />
      </button>
      <section className="hidden w-2/5 px-6 py-5 border-l-2 border-gray-300 lg:block lg:h-full bg-dark lg:border-l rounded-xl">
        <div className="flex flex-col text-white">
          <div className="flex items-center justify-between pb-3 mb-5 border-b border-gray-100">
            {" "}
            <h2 className="text-lg font-semibold">Chat</h2>
            <AiOutlineUser
              onClick={() => setShowMembers(true)}
              className="lg:hidden"
              size={24}
            />
          </div>
        </div>
        <div
          className="space-y-5 h-[calc(100%-129px)] text-white overflow-y-auto"
          ref={scrollRef}
        >
          {messages.map((item, index) => (
            <div key={index} className="mr-2">
              <div className="flex">
                <img
                  className="border border-gray-200 rounded-full w-9"
                  src="/assets/images/avatar.jpg"
                  alt={"avatar"}
                />
                <div className="flex items-center justify-between w-full">
                  <h4 className="ml-3 ">
                    {item.authorId == user?.userId}
                    {item.author?.nickname || item.author.user.username}
                  </h4>
                  <DropdownMenu />
                </div>
              </div>

              <div
                className="px-4 py-2 ml-12 text-sm bg-gray-100 border rounded-tl-none text-dark rounded-2xl"
                style={{ wordBreak: "break-word" }}
              >
                {item.content}
                <div className="flex justify-end mt-1 text-xs text-gray-500">
                  <i>
                    {new Date(item.createdAt).getHours().toLocaleString()}:
                    {new Date(item.createdAt).getMinutes().toLocaleString()}{" "}
                    {new Date(item.createdAt).getHours() < 14 ? "AM" : "PM"}
                  </i>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="w-full h-12 mt-5 overflow-hidden border rounded-full">
          <div className="relative w-full h-full" dir={"auto"}>
            <textarea
              dir={"auto"}
              placeholder="Write a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="absolute border text-black border-primary   top-0 left-0 flex items-center justify-center w-full h-full !pt-3.5 pl-4 text-sm bg-white rounded-full focus:outline-none focus:border-gray-500 "
              onClick={() => setShowPicker(false)}
            />
            <button
              onClick={() => setShowPicker(!showPicker)}
              className="absolute z-10 -translate-y-1/2 top-1/2 right-10"
            >
              <span role="img" aria-label="smiley-face">
                <BsEmojiSmile className={"text-black text-2xl"} />
              </span>
            </button>
            <button
              className="absolute z-10 -translate-y-1/2 top-1/2 right-2"
              onClick={sendMsg}
            >
              <IoSendSharp className={"text-primary text-2xl"} />
            </button>
          </div>
          <div
            className="absolute"
            style={{ bottom: 83, right: 26 }}
            hidden={!showPicker}
          >
            <Picker data={data} onEmojiSelect={handleEmojiSelect} />
          </div>
        </div>
      </section>
      {chatSidebar ? <ChatAside /> : ""}
    </>
  )
}
export default ChatsComponent
