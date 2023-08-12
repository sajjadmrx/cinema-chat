import React from "react"
import { Icon } from "../../../shared/interfaces/components/Icon.interface"
import { icons } from "./icons"

const colors = {
  black: "#171923",
  white: "#ffffff",
  blue: "#048AFB",
  gray: "#60637B",
  green: "#21A73F",
  orange: "#F6AD55",
  purple: "#3346F8",
  red: "#FF6161",
}

export const IconComponent = ({ name, size = 24, color = "gray", className }: Icon) => {
  const IconElement = icons[name]

  if (!icons[name]) {
    throw new Error(`Icon ${name} not found`)
  }

  const fill = colors?.[color]

  return (
    <svg
      aria-label={name}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
    >
      <IconElement />
    </svg>
  )
}
