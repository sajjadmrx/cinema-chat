import React from "react"
import { ButtonComponent } from "../../../components/Shared"
import ProfileDropdown from "./ProfileDropdown"

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between bg-white shadow-sm py-3 px-4">
      <ButtonComponent variant="secondary">New Room</ButtonComponent>
      <ProfileDropdown />
    </nav>
  )
}

export default Navbar
