import { useEffect, useRef, useState } from "react"
import Layout from "../../components/Layout"
import Navbar from "../../components/Layout/Navbar"
import VideoPlayer from "../../components/VideoPlayer"
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
import { Select } from "react-daisyui"
import { fetchMedia } from "../../services/media.service"
import { BASE_URL } from "../../shared/lib/axios"
let currentMediaId: number | null = null
export const RoomPage = (): any => {
  const playerRef = useRef(null)
  const navigate = useNavigate()
  const [isValidMember, setIsValidMember] = useState(false)
  const [isLoadingValidate, setIsLoadingValidate] = useState(true)
  const [showMembers, setShowMembers] = useState<boolean>(false)
  const [room, setRoom] = useState<Omit<Room, "_count">>()
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected)
  const [movies, setMovies] = useState<any[]>([])
  const [selectMedia, setSelectMedia] = useState<any>()
  const [videoJsOptions, setVideoJsOptions] = useState<any>()

  const { user } = useAuth()
  const params = useParams()

  useEffect(() => {
    function onConnect() {
      setIsConnected(true)
    }

    function onDisconnect() {
      setIsConnected(false)
    }
    socket.on("connect", onConnect)
    socket.on("disconnect", onDisconnect)

    return () => {
      socket.off("connect", onConnect)
      socket.off("disconnect", onDisconnect)
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
        setIsValidMember(true)
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

  useEffect(() => {
    if (isValidMember) {
    }
  }, [isValidMember])

  useEffect(() => {
    function fetchMovies() {
      fetchMedia(1, 10).then((res) => setMovies(res.data))
    }
    fetchMovies()
  }, [])
  useEffect(() => {
    if (selectMedia) {
      const media = movies.find((m) => m.movieId == selectMedia)
      currentMediaId = selectMedia
      let options = {
        autoplay: true,
        controls: true,
        responsive: true,
        fluid: true,
        sources: [
          {
            src: `${BASE_URL}/stream/${media.hlsPlaylistPath}`,
            type: "application/x-mpegURL",
          },
        ],
      }

      setVideoJsOptions(options)
    }
  }, [selectMedia])

  if (!isValidMember && isLoadingValidate) {
    return <h1 className={"text-center"}>waiting...</h1>
  }

  if (!isValidMember && !isLoadingValidate) {
    return navigate("/rooms")
  }

  const handlePlayerReady = (player: any) => {
    playerRef.current = player

    // You can handle player events here, for example:
    player.on("waiting", () => {
      videojs.log("player is waiting")
    })

    player.on("dispose", () => {
      videojs.log("player will dispose")
    })

    socket.on("FETCH_CURRENT_PLAYING", function (data) {
      if (player) {
        const currentTime = player?.currentTime() || 0
        const paused = player.paused() || true
        socket.emit(data.cbEvent, {
          cbTarget: data.cbTarget,
          mediaId: Number(currentMediaId),
          currentTime,
          paused,
          roomId: room?.roomId,
        })
      }
    })
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
                <h4 className="ml-3 -mb-1.5 font-bold">Call of Duty: World War II</h4>
              </div>
              <div className={""}>
                select movie:
                <Select
                  color={"ghost"}
                  onChange={(event) => setSelectMedia(event.target.value)}
                >
                  <Select.Option value={"default"} selected={true} disabled>
                    Pick your favorite movie
                  </Select.Option>
                  {movies.map((movie) => (
                    <Select.Option value={movie.movieId}>
                      {movie.description}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            </div>

            {/*<div className="bg-gray-200 w-full h-96 rounded-2xl mt-6 grid place-items-center border border-gray-300">*/}
            <div>
              <VideoPlayer options={videoJsOptions} onReady={handlePlayerReady} />
            </div>
          </div>
          {socket.connected && <ChatsComponent setShowMembers={setShowMembers} />}
        </section>
      </socketContext.Provider>
    </Layout>
  )
}
