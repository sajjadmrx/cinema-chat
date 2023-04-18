import { useState } from "react"

import { Icon } from "@/components/Shared"
import { IInput } from "@/types/components/Input"
import { classNames } from "@/utils/classNames"

export default function Input({
  type,
  value,
  placeholder,
  name,
  id,
  dir,
  icon,
  className,
  inputClassName,
  onChange,
}: IInput) {
  const [inputType, setInputType] = useState(type || "text")
  const [showPassword, setShowPassword] = useState(false)

  const onTogglePassword = () => {
    setShowPassword(!showPassword)
    setInputType(inputType === "password" ? "text" : "password")
  }

  return (
    <div className={classNames("relative", className)}>
      <input
        id={id}
        dir={dir}
        name={name}
        value={value}
        type={inputType}
        placeholder={placeholder}
        className={classNames(
          "w-full py-2.5 bg-white text-sm rounded-xl placeholder-gray-500 text-gray-800 transition duration-100 ease-in-out border border-gray-200 focus:border-blue-700 focus:ring-1 focus:ring-blue-700",
          type === "password" ? "pr-10" : "pr-4",
          icon ? " pl-10" : " pl-4",
          inputClassName,
        )}
        onChange={onChange}
      />
      {icon}
      {type === "password" && (
        <button
          type="button"
          style={{ transform: "translateY(-50%)" }}
          className="absolute top-1/2 right-3 transform -translate-y-1/2"
          onClick={onTogglePassword}
        >
          {showPassword ? (
            <Icon name="eye" size={16} />
          ) : (
            <Icon name="eye-slash" size={16} />
          )}
        </button>
      )}
    </div>
  )
}
