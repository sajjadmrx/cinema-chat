export interface Button {
  href?: string
  className?: string

  loading?: boolean
  disabled?: boolean

  rounded?: number | "full"
  type?: "button" | "submit" | "reset"
  size?: "small" | "medium" | "large"
  variant?: "primary" | "danger" | "secondary" | "outline-primary" | "outline-danger"

  children?: React.ReactNode
  rightIcon?: React.ReactNode
  leftIcon?: React.ReactNode

  onClick?: () => void
}
