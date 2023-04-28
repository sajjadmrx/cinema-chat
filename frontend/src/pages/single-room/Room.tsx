import { useEffect, useRef, useState } from "react"
import Layout from "../../components/Layout"
import Navbar from "../../components/Layout/Navbar"
import VideoPlayer from "../../components/VideoPlayer"
import Chats from "../../views/Room/Chats"
import MembersComponent from "../../views/Room/Members"
import videojs from "video.js"
import React from "react"
import { getMemberByMemberId } from "../../services/members.service"
import { useAuth } from "../../context/auth/AuthProvider"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { Room } from "@interfaces/schemas/Room.interface"

export const RoomPage = (): any => {
  const playerRef = useRef(null)
  const params = useParams()
  const navigate = useNavigate()
  const [isValidMember, setIsValidMember] = useState(false)
  const [isLoadingValidate, setIsLoadingValidate] = useState(true)
  const [room, setRoom] = useState<Omit<Room, "_count">>()
  const { user } = useAuth()
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

  if (!isValidMember && isLoadingValidate) {
    return <h1 className={"text-center"}>waiting...</h1>
  }

  if (!isValidMember && !isLoadingValidate) {
    return navigate("/rooms")
  }
  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: "", // "https://hajifirouz15.asset.aparat.com/aparat-video/8c822a5d9edf7b9d01b5b7618199f2fb51781965-360p.apt/chunk.m3u8?wmsAuthSign=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjUwNWJkNGEzZDIwMTFjNDFjODJkMDVkYzJmMTA4YTQ0IiwiZXhwIjoxNjgyNzE1MjE5LCJpc3MiOiJTYWJhIElkZWEgR1NJRyJ9.2ZwFvs7CFIlnlqY-PNrjTrP2mlGlMcis9utrrW3Uo-8",
        type: "application/x-mpegURL",
      },
    ],
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
  }
  return (
    <Layout>
      <Navbar />
      <section className="flex h-[calc(100vh-72px)]">
        <MembersComponent roomId={Number(params.id)} />
        <div className="flex-1 px-6 py-5">
          <div className="flex items-center border-b pb-5 border-b-gray-100">
            <img
              className="w-16 h-16 rounded-full border-[6px] border-gray-200"
              src="https://xsgames.co/randomusers/avatar.php?g=pixel"
              alt={""}
            />
            <h4 className="ml-3 -mb-1.5 font-bold">Call of Duty: World War II</h4>
          </div>
          {/*<div className="bg-gray-200 w-full h-96 rounded-2xl mt-6 grid place-items-center border border-gray-300">*/}
          <div>
            <VideoPlayer options={videoJsOptions} onReady={handlePlayerReady} />
          </div>
        </div>
        <Chats />
      </section>
    </Layout>
  )
}
