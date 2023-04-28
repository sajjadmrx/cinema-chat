import { useRef, useState } from "react"
import { motion } from "framer-motion"

import { classNames } from "../../../utils"
import { useOnClickOutside } from "../../../hooks/useOnClickOutside"
import { IconComponent } from "../../Shared"
import React from "react"

const ProfileDropdown = () => {
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
        <span className="mr-3 font-semi-bold">Johne Doe</span>
        <img
          className="w-12 h-12 object-cover rounded-full border border-gray-200"
          src="https://xsgames.co/randomusers/avatar.php?g=pixel"
         alt={""}/>
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
            <IconComponent name="logout" size={22} />
            <span className="text-base ml-2">Log out</span>
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default ProfileDropdown
