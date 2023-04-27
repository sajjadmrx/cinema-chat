import { IconName } from "../../../components/Shared/Icon/icons"

export interface Icon {
  size?: number
  className?: string
  color?: "black" | "blue" | "gray" | "green" | "orange" | "purple" | "red" | "white"
  name: IconName
}
