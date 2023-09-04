import React from "react"

import "video.js/dist/video-js.css"
import { socket } from "../../hooks/useSocket"

import { Button, Card, CardBody, Image, Progress } from "@nextui-org/react"
import { clsx } from "@nextui-org/shared-utils"
import { useEffect, useRef } from "react"
import { AiOutlineHeart } from "react-icons/ai"
import { BsFillPauseCircleFill } from "react-icons/bs"
import { GiNextButton, GiPreviousButton } from "react-icons/gi"
import { classNames } from "../../utils/classNames"
// export interface MusicPlayerPropp extends CardProps {}
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
    target.currentTime = currentTime
    paused && target.pause()
  }
  return (
    <div>
      {urlType === "MUSIC" ? (
        // <div>
        //   <audio
        //     ref={playerRef as React.Ref<HTMLAudioElement>}
        //     controls
        //     autoPlay
        //     onPlay={onPlay}
        //     id="player"
        //     onTimeUpdate={}
        //   >
        //     <source src={src} />
        //   </audio>
        // </div>
        <Card
          isBlurred
          className={clsx(
            "border-none bg-background/60 dark:bg-default-100/50",
            classNames,
          )}
          shadow="sm"
        >
          <CardBody>
            <div className="grid items-center justify-center grid-cols-6 gap-6 md:grid-cols-12 md:gap-4">
              <div className="relative col-span-6 md:col-span-4">
                <Image
                  alt="Album cover"
                  className="object-cover"
                  classNames={{
                    base: "shadow-black/20",
                  }}
                  height={200}
                  shadow="lg"
                  src="/images/album-cover.png"
                  width="100%"
                />
              </div>

              <div className="flex flex-col col-span-6 md:col-span-8">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-0">
                    <h3 className="font-semibold text-foreground/90">Daily Mix</h3>
                    <p className="text-sm text-foreground/80">12 Tracks</p>
                    <h1 className="mt-2 text-lg font-medium">Frontend Radio</h1>
                  </div>
                  <Button
                    isIconOnly
                    className="text-default-900/60 data-[hover]:bg-foreground/10 -translate-y-2 translate-x-2"
                    radius="full"
                    variant="light"
                  >
                    <AiOutlineHeart />
                  </Button>
                </div>

                <div className="flex flex-col gap-1 mt-3">
                  <Progress
                    aria-label="Music progress"
                    classNames={{
                      indicator: "bg-default-800 dark:bg-white",
                      track: "bg-default-500/30",
                    }}
                    color="default"
                    size="sm"
                    value={33}
                  >
                    <audio
                      ref={playerRef as React.Ref<HTMLAudioElement>}
                      controls
                      autoPlay
                      onPlay={onPlay}
                      id="player"
                      className="hidden"
                      onTimeUpdate={handleTimeUpdate}
                    >
                      <source src={src} />
                    </audio>
                  </Progress>
                  <div className="flex justify-between">
                    <p className="text-sm">{currentTime}</p>
                    <p className="text-sm text-foreground/50">4:32</p>
                  </div>
                </div>

                <div className="flex items-center justify-center w-full">
                  <Button
                    isIconOnly
                    className="data-[hover]:bg-foreground/10"
                    radius="full"
                    variant="light"
                  >
                    <GiPreviousButton size={44} />
                  </Button>
                  <Button
                    isIconOnly
                    className="w-auto h-auto data-[hover]:bg-foreground/10"
                    radius="full"
                    variant="light"
                    onClick={handlePlayPause}
                  >
                    <BsFillPauseCircleFill size={54} />
                  </Button>
                  <Button
                    isIconOnly
                    className="data-[hover]:bg-foreground/10"
                    radius="full"
                    variant="light"
                  >
                    <GiNextButton size={44} />
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
