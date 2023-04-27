import { ReactNode } from "react"

export interface Props {
  className?: string
  variant: "circle" | "square"
  size: number
  children?: ReactNode
  src?: string
  alt?: string
  fontSize?: number
}
