import { CircularProgress } from "@nextui-org/react"
import React from "react"

export default function Loading() {
  return (
    <div className="flex items-center justify-center w-full h-screen -">
      <CircularProgress
        classNames={{
          svg: "w-36 h-36 drop-shadow-md",
          indicator: "stroke-primary",
          track: "stroke-primary/10",
          value: "text-3xl font-semibold text-white",
        }}
        color="danger"
        aria-label="Loading..."
      />
    </div>
  )
}
