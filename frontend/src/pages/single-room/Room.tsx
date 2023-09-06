import { Room } from "@interfaces/schemas/Room.interface"
import { MemberWithRoom } from "@interfaces/schemas/member.interface"
import React, { Suspense, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Layout from "../../components/Layout"
import Navbar from "../../components/Layout/Navbar"
import Loading from "../../components/Loading/index"
import MediaPlayer from "../../components/VideoPlayer/index"
import { useAuth } from "../../context/auth/AuthProvider"
import { socketContext } from "../../context/socket/socketContext"
import { socket } from "../../hooks/useSocket"
import { getMemberByMemberId } from "../../services/members.service"
const ChatsComponent = React.lazy(() => import("../../views/Room/Chats"))
const MembersComponent = React.lazy(() => import("../../views/Room/Members"))

// const currentMediaId: number | null = null
export const RoomPage = (): JSX.Element => {
  // const playerRef = useRef(null)
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

  if (!member && isLoadingValidate) <Loading />

  if (!member && !isLoadingValidate) navigate("/rooms")
  return (
    <Layout>
      <Navbar />
      <section className="flex p-5 w-full h-[calc(100vh-72px)]   flex-row justify-between items-center">
        <div className="flex w-full bg-semidark h-[calc(100vh-100px)] p-5 rounded-xl">
          <socketContext.Provider
            value={{
              isConnected,
              setIsConnected,
            }}
          >
            {socket.connected && (
              <Suspense fallback={<Loading />}>
                <MembersComponent
                  roomId={Number(params.id)}
                  showMembers={showMembers}
                  setShowMembers={setShowMembers}
                />
              </Suspense>
            )}
            <div className="flex flex-col items-center justify-center w-full h-full px-6 py-5 rounded-xl bg-dark">
              <div
                className={
                  "flex flex-col gap-36 w-full h-full justify-center items-center rounded-2xl"
                }
              >
                {member?.permissions.includes("ADMINISTRATOR") ? (
                  <div className={"flex flex-col gap-2 mt-10"}>
                    <div className="flex flex-col gap-2">
                      <h1 className="text-2xl font-extrabold text-primary">Play Media</h1>
                      <p className="text-white">insert your content to play it ..</p>
                      <hr />
                    </div>
                    <input
                      placeholder={"enter your url"}
                      className={
                        "w-80 rounded-2xl px-5 py-2 border border-primary text-semidark"
                      }
                      value={src}
                      onChange={(event) => setSrc(event.target.value)}
                    />
                    <button
                      className={
                        "bg-primary text-white scale-100 hover:scale-125 delay-75 duration-100 w-max h-max px-10 rounded-2xl font-bold py-2"
                      }
                      onClick={() => playBtnHandling(src)}
                    >
                      Play
                    </button>
                  </div>
                ) : (
                  <div className={"flex flex-row gap-11 bg-primary"}>
                    <button onClick={() => syncMedia()}>Refresh</button>
                  </div>
                )}
                <MediaPlayer
                  src={videoJsOptions?.src}
                  roomId={Number(params.id)}
                  paused={videoJsOptions.paused}
                  currentTime={videoJsOptions.currentTime}
                />
              </div>
            </div>
            {socket.connected && <ChatsComponent setShowMembers={setShowMembers} />}
          </socketContext.Provider>
        </div>
      </section>
    </Layout>
  )
}
