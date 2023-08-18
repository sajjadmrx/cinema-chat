import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from "@nextui-org/react"
import React, { useRef, useState } from "react"
import { useAuth } from "../../../context/auth/AuthProvider"
import { useOnClickOutside } from "../../../hooks/useOnClickOutside"
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
    <div className="flex items-center gap-4">
      <Dropdown placement="bottom-start">
        <DropdownTrigger>
          <User
            dir="rtl"
            as="button"
            avatarProps={{
              // isBordered: true,
              src: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
            }}
            className="text-white transition-transform"
            description={user.userId + "@"}
            name={user.username}
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="User Actions" variant="flat">
          <DropdownItem key="profile" className="gap-2 h-14">
            <p className="font-bold">Signed in as</p>
            <p className="font-bold">{user.email}</p>
          </DropdownItem>
          <DropdownItem key="settings">My Settings</DropdownItem>
          <DropdownItem key="team_settings">Team Settings</DropdownItem>
          <DropdownItem key="logout" color="danger" onClick={logout}>
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}

export default ProfileDropdown
