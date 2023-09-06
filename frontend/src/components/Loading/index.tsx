import { CircularProgress } from "@nextui-org/react"
import React from "react"

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-dark -">
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
      <h1 className="mt-2 text-2xl font-extrabold text-primary">Loading ...</h1>
    </div>
  )
}
