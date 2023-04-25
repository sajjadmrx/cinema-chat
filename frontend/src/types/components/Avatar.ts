import { ReactNode } from "react"

export interface IProps {
  className?: string
  variant: "circle" | "square"
  size: number
  children?: ReactNode
  src?: string
  alt?: string
  fontSize?: number
}
