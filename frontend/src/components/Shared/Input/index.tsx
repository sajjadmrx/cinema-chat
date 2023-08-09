import React, { useState } from "react"

import { Input } from "../../../shared/interfaces/components/input.interface"
import { classNames } from "../../../utils"
import { IconComponent } from "../Icon"

export function InputComponent({
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
  formik,
}: Input) {
  const [inputType, setInputType] = useState(type || "text")
  const [showPassword, setShowPassword] = useState(false)

  const onTogglePassword = () => {
    setShowPassword(!showPassword)
    setInputType(inputType === "password" ? "text" : "password")
  }

  return (
    <div>
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
          {...formik.getFieldProps(name)}
        />
        {icon}
        {type === "password" && (
          <button
            type="button"
            style={{ transform: "translateY(-50%)" }}
            className="absolute transform -translate-y-1/2 top-1/2 right-3"
            onClick={onTogglePassword}
          >
            {showPassword ? (
              <IconComponent name="eye" size={16} />
            ) : (
              <IconComponent name="eye-slash" size={16} />
            )}
          </button>
        )}
      </div>
      {formik?.errors[name] && formik?.touched[name] && (
        <div className="text-xs text-red-500 mt-1 !text-left">{formik.errors[name]}</div>
      )}
    </div>
  )
}
