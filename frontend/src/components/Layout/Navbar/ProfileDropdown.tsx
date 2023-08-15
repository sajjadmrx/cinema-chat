import { motion } from "framer-motion"
import { useRef, useState } from "react"

import { User } from "@nextui-org/react"
import React from "react"
import { useAuth } from "../../../context/auth/AuthProvider"
import { useOnClickOutside } from "../../../hooks/useOnClickOutside"
import { classNames } from "../../../utils"
import { IconComponent } from "../../Shared"
const ProfileDropdown = () => {
  const [open, setOpen] = useState(false)
  const onOpen = () => setOpen(true)
  const onClose = () => setOpen(false)
  const logout = () => {
    localStorage.removeItem("token")
    location.reload()
  }
  const ref = useRef(null)
  useOnClickOutside(ref, onClose)
  const { user } = useAuth()
  if (!user) return <div>loading</div>
  return (
    <div className="relative z-30">
      <div
        onClick={onOpen}
        className={classNames(
          "cursor-pointer rounded-full flex items-center",
          open && "pointer-events-none",
        )}
      >
        <User
          dir="rtl"
          name={user.username || ""}
          description={user.userId}
          avatarProps={{
            src: "https://avatars.githubusercontent.com/u/30373425?v=4",
          }}
        />
      </div>

      <motion.div
        className="absolute z-50 flex flex-col py-2 mt-2 overflow-hidden bg-white border select-none right-3 w-44 rounded-xl dark:bg-dark-gray700 dark:text-white"
        initial="hide"
        ref={ref}
        animate={open ? "show" : "hide"}
        transition={{ duration: 0.2, type: "tween" }}
        variants={{
          show: { opacity: 1, display: "flex", translateY: 0, scale: 1 },
          hide: { opacity: 0, translateY: 15, transitionEnd: { display: "none" } },
        }}
      >
        {" "}
        <div className="w-full">
          <button
            onClick={onClose}
            className="w-full flex px-3 py-2 text-xs rounded-[4px] transition-colors text-[#37352fa6] hover:bg-[#ebebea]"
          >
            <button className="flex" onClick={logout}>
              <IconComponent name="user" size={22} />
              <span className="ml-2 text-base">Profile</span>
            </button>
          </button>
        </div>
        <div className="w-full">
          {/* <Button
            color="danger"
            onClick={logout}
            variant="bordered"
            className="w-full flex justify-start items-center  rounded-[4px] transition-colors hover:bg-[#ebebea]"
            startContent={<IconComponent name="logout" color="red" size={22} />}
          >
            Log out
          </Button> */}
          <button
            onClick={onClose}
            className="w-full flex px-3 py-2 text-xs rounded-[4px] transition-colors text-[#37352fa6] hover:bg-[#ebebea]"
          >
            <button className="flex" onClick={logout}>
              <IconComponent name="logout" color="red" size={22} />
              <span className="ml-2 text-base text-danger-400">Log out</span>
            </button>
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default ProfileDropdown
