import { useRef, useState } from "react"
import { motion } from "framer-motion"

import { classNames } from "../../../utils"
import { useOnClickOutside } from "../../../hooks/useOnClickOutside"
import { Icon } from "../../../components/Shared"
import React from "react"

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
        <Icon name="more" size={20} />
      </div>

      <motion.div
        className="absolute border right-3 overflow-hidden w-44 py-2 z-50 mt-2 rounded-xl select-none bg-white dark:bg-dark-gray700 dark:text-white"
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
            <Icon name="undo" size={18} />
            <span className="text-sm ml-2">Replay</span>
          </button>
          <button
            onClick={onClose}
            className="w-full flex px-3 py-2 text-xs rounded-[4px] transition-colors text-[#37352fa6] hover:bg-[#ebebea]"
          >
            <Icon name="copy" size={18} />
            <span className="text-sm ml-2">Copy</span>
          </button>
          <button
            onClick={onClose}
            className="w-full flex px-3 py-2 text-xs rounded-[4px] transition-colors text-[#37352fa6] hover:bg-[#ebebea]"
          >
            <Icon name="trash" size={18} />
            <span className="text-sm ml-2">Delete</span>
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default DropdownMenu
