import { useEffect, useRef, useState } from "react"
import Layout from "../../components/Layout"
import Navbar from "../../components/Layout/Navbar"
import MediaPlayer from "../../components/VideoPlayer"
import ChatsComponent from "../../views/Room/Chats"
import MembersComponent from "../../views/Room/Members"
import videojs from "video.js"
import React from "react"
import { getMemberByMemberId } from "../../services/members.service"
import { useAuth } from "../../context/auth/AuthProvider"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { Room } from "@interfaces/schemas/Room.interface"
import { socketContext } from "../../context/socket/socketContext"
import { socket } from "../../hooks/useSocket"
import { Button, Input, Select } from "react-daisyui"
import { MemberWithRoom } from "@interfaces/schemas/member.interface"

let currentMediaId: number | null = null
export const RoomPage = (): any => {
  const playerRef = useRef(null)
  const navigate = useNavigate()
  const [member, setMember] = useState<MemberWithRoom | null>(null)
  const [isLoadingValidate, setIsLoadingValidate] = useState(true)
  const [showMembers, setShowMembers] = useState<boolean>(false)
  const [room, setRoom] = useState<Omit<Room, "_count">>()
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected)
  const [src, setSrc] = useState<string>(
    "https://cdnmrtehran.ir/media/mp3s/01/e52db2c108_8f9b6cb5cf1b09a839ccb542b7597798.mp3",
  )
  const [videoJsOptions, setVideoJsOptions] = useState<any>({
    src: "",
    currentTime: 0,
    paused: false,
  })

  const { user } = useAuth()
  const params = useParams()

  useEffect(() => {
    function onConnect() {
      setIsConnected(true)
    }

    function onDisconnect() {
      setIsConnected(false)
    }

    function onStreamPlay(src: string) {
      playHandling(src, { currentTime: 0, paused: false })
    }

    socket.on("connect", onConnect)
    socket.on("disconnect", onDisconnect)
    socket.on("STREAM_PLAY", onStreamPlay)
    syncMedia()
    socket.on("CB_CURRENT_PLAYING", (data) => {
      playHandling(data.src, {
        currentTime: data.currentTime,
        paused: data.paused,
      })
    })
    return () => {
      socket.off("connect", onConnect)
      socket.off("disconnect", onDisconnect)
      socket.on("STREAM_PLAY", onStreamPlay)
    }
  }, [])

  useEffect(() => {
    if (!user) return navigate("/rooms")
    const fetchCurrentMember = async () => {
      try {
        const { data: currentMember } = await getMemberByMemberId(
          Number(params.id),
          user.userId,
        )
        setRoom(currentMember.room)
        setMember(currentMember)
      } catch (e) {
        console.log(e)
      } finally {
        setIsLoadingValidate(false)
      }
    }
    return () => {
      fetchCurrentMember()
    }
  }, [])

  function playHandling(src: string, items: { currentTime: number; paused: boolean }) {
    const options = {
      currentTime: items.currentTime,
      paused: items.paused,
      src: src,
    }

    setVideoJsOptions(options)
  }
  function playBtnHandling(src: string) {
    socket.emit("STREAM_PLAY", {
      roomId: Number(params.id),
      src,
    })
  }

  function syncMedia() {
    socket.emit("GET_CURRENT_PLAYING", { roomId: Number(params.id) })
  }

  if (!member && isLoadingValidate) {
    return <h1 className={"text-center"}>waiting...</h1>
  }

  if (!member && !isLoadingValidate) {
    return navigate("/rooms")
  }
  return (
    <Layout>
      <Navbar />
      <socketContext.Provider
        value={{
          isConnected,
          setIsConnected,
        }}
      >
        <section className="flex h-[calc(100vh-72px)] lg:flex-row flex-col">
          {socket.connected && (
            <MembersComponent
              roomId={Number(params.id)}
              showMembers={showMembers}
              setShowMembers={setShowMembers}
            />
          )}
          <div className="flex-1 px-6 py-5">
            <div className={"flex flex-row gap-40"}>
              <div className="flex items-center border-b pb-5 border-b-gray-100">
                <img
                  className="w-16 h-16 rounded-full border-[6px] border-gray-200"
                  src="https://xsgames.co/randomusers/avatar.php?g=pixel"
                  alt={""}
                />
                <h4 className="ml-3 -mb-1.5 font-bold">{room?.name}</h4>
              </div>
              <div className={""}>
                پخش مدیا
                {member?.permissions.includes("ADMINISTRATOR") ? (
                  <div className={"flex flex-row gap-11"}>
                    <Input
                      type={"url"}
                      placeholder={"enter your url"}
                      color={"ghost"}
                      className={"w-80"}
                      value={src}
                      onChange={(event) => setSrc(event.target.value)}
                    ></Input>
                    <Button onClick={() => playBtnHandling(src)}>پخش</Button>
                  </div>
                ) : (
                  <div className={"flex flex-row gap-11"}>
                    <Button onClick={() => syncMedia()}>رفرش</Button>
                  </div>
                )}
              </div>
            </div>

            {/*<div className="bg-gray-200 w-full h-96 rounded-2xl mt-6 grid place-items-center border border-gray-300">*/}
            <div>
              <MediaPlayer
                src={videoJsOptions?.src}
                roomId={Number(params.id)}
                paused={videoJsOptions.paused}
                currentTime={videoJsOptions.currentTime}
              />
            </div>
          </div>
          {socket.connected && <ChatsComponent setShowMembers={setShowMembers} />}
        </section>
      </socketContext.Provider>
    </Layout>
  )
}
