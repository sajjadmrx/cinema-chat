import { motion } from "framer-motion"
import { useRef, useState } from "react"

import React from "react"
import { IconComponent } from "../../../components/Shared"
import { useOnClickOutside } from "../../../hooks/useOnClickOutside"
import { classNames } from "../../../utils"

const DropdownMenu = () => {
  const [open, setOpen] = useState(false)
  const onOpen = () => setOpen(true)
  const onClose = () => setOpen(false)

  const ref = useRef(null)
  useOnClickOutside(ref, onClose)

  return (
    <div className="relative z-30">
      <div
        onClick={onOpen}
        className={classNames(
          "cursor-pointer rounded-full flex items-center",
          open && "pointer-events-none",
        )}
      >
        <IconComponent name="more" size={20} />
      </div>

      <motion.div
        className="absolute z-50 py-2 mt-2 overflow-hidden bg-white border select-none right-3 w-44 rounded-xl dark:bg-dark-gray700 dark:text-white"
        initial="hide"
        ref={ref}
        animate={open ? "show" : "hide"}
        transition={{ duration: 0.2, type: "tween" }}
        variants={{
          show: { opacity: 1, display: "flex", translateY: 0, scale: 1 },
          hide: { opacity: 0, translateY: 15, transitionEnd: { display: "none" } },
        }}
      >
        <div className="w-full">
          <button
            onClick={onClose}
            className="w-full flex px-3 py-2 text-xs rounded-[4px] transition-colors text-[#37352fa6] hover:bg-[#ebebea]"
          >
            <IconComponent name="undo" size={18} />
            <span className="ml-2 text-sm">Replay</span>
          </button>
          <button
            onClick={onClose}
            className="w-full flex px-3 py-2 text-xs rounded-[4px] transition-colors text-[#37352fa6] hover:bg-[#ebebea]"
          >
            <IconComponent name="copy" size={18} />
            <span className="ml-2 text-sm">Copy</span>
          </button>
          <button
            onClick={onClose}
            className="w-full flex px-3 py-2 text-xs rounded-[4px] transition-colors text-[#37352fa6] hover:bg-[#ebebea]"
          >
            <IconComponent name="trash" size={18} />
            <span className="ml-2 text-sm">Delete</span>
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default DropdownMenu
