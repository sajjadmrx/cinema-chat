import React, { useRef } from "react"
import videojs from "video.js"
import Chatbox from "../../components/Chatbox"
import MediaPlayer from "../../components/VideoPlayer"

const MainPage = () => {
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
    <div>
      <Chatbox />
      <MediaPlayer options={videoJsOptions} onReady={handlePlayerReady} />
    </div>
  )
}

export default MainPage
