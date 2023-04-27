import { Button } from "../../../components/Shared"
import ProfileDropdown from "./ProfileDropdown"

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between bg-white shadow-sm py-3 px-4">
      <Button variant="secondary">New Room</Button>
      <ProfileDropdown />
    </nav>
  )
}

export default Navbar
