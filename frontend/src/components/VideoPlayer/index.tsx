import React from "react"

import "video.js/dist/video-js.css"
import { socket } from "../../hooks/useSocket"
interface Prop {
  src: string
  roomId: number
}
import { useEffect, useRef, useState } from "react"

interface Props {
  src: string
  roomId: number
  currentTime: number
  paused: boolean
}

export const MediaPlayer: React.FC<Props> = ({ src, roomId, currentTime, paused }) => {
  const urlType = getUrlType(src || "")
  const playerRef = useRef<HTMLVideoElement | HTMLAudioElement>(null)

  useEffect(() => {
    const handleFetchCurrentPlaying = (data: any) => {
      const player = playerRef.current
      if (player) {
        const { currentTime, paused } = player
        socket.emit(data.cbEvent, {
          cbTarget: data.cbTarget,
          currentTime,
          paused,
          roomId: roomId,
        })
      }
    }

    socket.on("FETCH_CURRENT_PLAYING", handleFetchCurrentPlaying)

    return () => {
      socket.off("FETCH_CURRENT_PLAYING", handleFetchCurrentPlaying)
    }
  }, [roomId])

  const handleTimeUpdate = () => {
    const player = playerRef.current
    if (player) {
      currentTime = player.currentTime
    }
  }

  const handlePlayPause = () => {
    const player = playerRef.current
    if (player) {
      if (player.paused) {
        player.play()
        paused = false
      } else {
        player.pause()
        paused = true
      }
    }
  }

  const handleSeek = (time: number) => {
    const player = playerRef.current
    if (player) {
      player.currentTime = time
      // Update the parent component's state with the new currentTime value
      currentTime = time
    }
  }

  if (urlType === "UNKNOWN") {
    return null // You can return some placeholder or error message here
  }
  function onPlay(e: React.SyntheticEvent<HTMLAudioElement, Event>) {
    const target = e.currentTarget
    console.log(target)
    target.currentTime = currentTime
    paused && target.pause()
  }
  return (
    <div>
      {urlType === "MUSIC" ? (
        <div>
          <audio
            ref={playerRef as React.Ref<HTMLAudioElement>}
            controls
            autoPlay
            onPlay={onPlay}
            id="player"
            onTimeUpdate={handleTimeUpdate}
          >
            <source src={src} />
          </audio>
        </div>
      ) : (
        <div>
          <video
            ref={playerRef as React.Ref<HTMLVideoElement>}
            controls
            autoPlay
            onPlay={onPlay}
            id="player"
            onTimeUpdate={handleTimeUpdate}
          >
            <source src={src} />
          </video>
        </div>
      )}

      <div>
        <button onClick={handlePlayPause}>{paused ? "Play" : "Pause"}</button>
        <input
          type="range"
          value={currentTime}
          step={1}
          min={0}
          max={playerRef.current?.duration || 0}
          onChange={(e) => handleSeek(parseFloat(e.target.value))}
        />
      </div>
    </div>
  )
}

function getUrlType(url: string) {
  const audioExtensions = ["mp3", "wav", "ogg", "flac", "aac", "wma", "m4a"]
  const videoExtensions = ["mp4", "avi", "mkv", "wmv", "mov", "flv", "webm"]

  // @ts-ignore
  const fileExtension = url.split(".").pop().toLowerCase()

  if (audioExtensions.includes(fileExtension)) {
    return "MUSIC"
  } else if (videoExtensions.includes(fileExtension)) {
    return "VIDEO"
  } else {
    return "UNKNOWN"
  }
}

export default MediaPlayer
