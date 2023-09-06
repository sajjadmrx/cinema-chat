import React, { useState } from "react"

import "video.js/dist/video-js.css"
import { socket } from "../../hooks/useSocket"

import { Button, Card, CardBody, Progress } from "@nextui-org/react"
import { useEffect, useRef } from "react"
import { AiFillPlayCircle } from "react-icons/ai"
import { classNames } from "../../utils/classNames"

interface Prop {
  src: string
  roomId: number
}

interface Props {
  src: string
  roomId: number
  currentTime: number
  paused: boolean
}

export const MediaPlayer: React.FC<Props> = ({ src, roomId, currentTime, paused }) => {
  const urlType = getUrlType(src || "")
  const playerRef = useRef<HTMLVideoElement | HTMLAudioElement>(null)
  const [isPause, setIsPause] = useState(true)
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
        setIsPause(false)
      } else {
        player.pause()
        paused = true
        setIsPause(true)
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
    target.currentTime = currentTime
    paused && target.pause()
  }
  return (
    <div className="mb-10">
      {urlType === "MUSIC" ? (
        <Card
          isBlurred
          className={classNames(
            "border-none bg-background/60 dark:bg-default-100/50",
            classNames,
          )}
          shadow="sm"
        >
          <CardBody>
            <audio
              className=""
              ref={playerRef as React.Ref<HTMLAudioElement>}
              controls
              autoPlay
              onPlay={onPlay}
              id="player"
              onTimeUpdate={handleTimeUpdate}
            >
              <source src={src} />
            </audio>
            <div className="flex items-center justify-center ">
              <div className="flex flex-col items-center justify-center w-full col-span-6 md:col-span-8">
                <div className="flex flex-col w-full gap-1 mt-3">
                  <Progress
                    aria-label="Music progress"
                    classNames={{
                      indicator: "bg-default-800 dark:bg-white",
                      track: "bg-default-500/30",
                    }}
                    color="default"
                    size="sm"
                    value={50}
                  ></Progress>
                  <input
                    type="range"
                    aria-label="Music progress"
                    value={currentTime}
                    step={1}
                    min={0}
                    className="h-1.5 !bg-gray-700 text-gray-600 "
                    max={playerRef.current?.duration || 0}
                    onChange={(e) => handleSeek(parseFloat(e.target.value))}
                  />
                  <div className="flex justify-between">
                    <p className="text-sm">{currentTime}</p>
                    <p className="text-sm text-foreground/50">5:31</p>
                  </div>
                </div>
                <div className="flex items-center justify-center w-full mx-auto my-2">
                  <Button
                    isIconOnly
                    className="w-auto h-auto data-[hover]:bg-foreground/10"
                    radius="full"
                    variant="light"
                    onClick={handlePlayPause}
                  >
                    <AiFillPlayCircle size={54} className="mx-2 text-[#DC143C]" />
                  </Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
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

      {/* <div>
        <button onClick={handlePlayPause}>{paused ? "Play" : "Pause"}</button>
        <input
          type="range"
          value={currentTime}
          step={1}
          min={0}
          max={playerRef.current?.duration || 0}
          onChange={(e) => handleSeek(parseFloat(e.target.value))}
        />
      </div> */}
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
