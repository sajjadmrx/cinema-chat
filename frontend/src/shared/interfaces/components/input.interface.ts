import React from "react"

export interface Input {
  type?: string
  value?: string
  placeholder?: string
  name: string
  id?: string
  dir?: "ltr" | "rtl"
  className?: string
  inputClassName?: string
  icon?: any
  formik?: any

  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
}
