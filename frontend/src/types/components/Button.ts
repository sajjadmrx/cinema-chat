export interface IButton {
  href?: string
  className?: string

  loading?: boolean
  disabled?: boolean

  type?: "button" | "submit" | "reset"
  size?: "small" | "medium" | "large"
  variant?: "primary" | "danger" | "secondary" | "outline-primary" | "outline-danger"

  children?: React.ReactNode
  rightIcon?: React.ReactNode
  leftIcon?: React.ReactNode

  onClick?: () => void
}
