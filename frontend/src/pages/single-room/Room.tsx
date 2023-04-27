import { useRef } from "react"
import Layout from "../../components/Layout"
import Navbar from "../../components/Layout/Navbar"
import VideoPlayer from "../../components/VideoPlayer"
import Chats from "../../views/Room/Chats"
import Members from "../../views/Room/Members"
import videojs from "video.js"
import React from "react"

const Room = () => {
  const playerRef = useRef(null)

  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: "http://193.36.85.124:4000/stream/hls/cat/cat_480_hls.m3u8",
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
        <Members />
        <div className="flex-1 px-6 py-5">
          <div className="flex items-center border-b pb-5 border-b-gray-100">
            <img
              className="w-16 h-16 rounded-full border-[6px] border-gray-200"
              src="https://xsgames.co/randomusers/avatar.php?g=pixel"
              alt={""}
            />
            <h4 className="ml-3 -mb-1.5 font-bold">Call of Duty: World War II</h4>
          </div>
          <div className="bg-gray-200 w-full h-96 rounded-2xl mt-6 grid place-items-center border border-gray-300">
            <VideoPlayer options={videoJsOptions} onReady={handlePlayerReady} />
          </div>
        </div>
        <Chats />
      </section>
    </Layout>
  )
}

export default Room
