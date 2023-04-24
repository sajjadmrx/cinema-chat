import Link from "next/link"

import { IButton } from "@/types/components/Button"
import { classNames } from "@/utils/classNames"

const Button = ({
  children,
  className,
  disabled,
  href,
  leftIcon,
  loading,
  onClick,
  rightIcon,
  size = "medium",
  type,
  variant,
  rounded,
}: IButton) => {
  const handleClickButton = () => {
    if (!disabled && !loading && typeof onClick === "function") {
      onClick()
    }
  }

  // Wrap all element props in a single object.
  const elementProps: any = {
    type: href ? null : type || "button",
    onClick: handleClickButton,
    disabled: disabled,
    className: classNames(
      "appearance-none flex relative text-center inline-block overflow-hidden cursor-pointer select-none transition duration-150 ease-in-out transform border",

      typeof rounded === "number" && rounded,
      rounded === "full" && "rounded-full",
      !rounded && "rounded-xl",

      disabled && "cursor-not-allowed opacity-75",
      leftIcon || (rightIcon && "space-x-2 space-x-reverse"),

      variant === "primary" &&
        "text-white bg-primary hover:bg-primaryHover active:bg-primaryActive",
      variant === "danger" &&
        "text-white bg-secondary hover:bg-secondaryHover active:bg-secondaryActive",
      variant === "secondary" &&
        "text-gray-600 bg-white border-gray-200 hover:bg-gray-50 active:bg-gray-100",
      variant === "outline-primary" &&
        "text-primary border-primary hover:bg-primary/5 active:bg-primary/10",
      variant === "outline-danger" &&
        "text-secondary border-secondary hover:bg-secondary/5 active:bg-secondary/10",

      size === "large" && "px-6 py-3.5",
      size === "medium" && "px-4 py-2",
      size === "small" && "px-4 py-2 text-sm",

      className,
    ),
  }

  // If button is loading, we'll show a spinner.
  let loadingContent = null
  if (loading) {
    loadingContent = (
      <span
        style={{ margin: 0 }}
        className={classNames(
          "absolute inset-0 grid place-items-center",
          variant === "primary" ? "bg-primary" : "bg-white",
        )}
      >
        <svg
          fill="none"
          viewBox="0 0 24 24"
          className={classNames(
            "animate-spin h-5 w-5",
            variant === "primary" && "text-white",
            variant === "secondary" && "text-primary",
            variant === "outline-primary" && "text-primaryActive",
          )}
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </span>
    )
  }

  const elementChildren = (
    <>
      {leftIcon}
      <span>{children}</span>
      {rightIcon}
      {loadingContent}
    </>
  )

  return href ? (
    <Link href={href} {...elementProps}>
      {elementChildren}
    </Link>
  ) : (
    <button role="button" {...elementProps}>
      {elementChildren}
    </button>
  )
}

export default Button
