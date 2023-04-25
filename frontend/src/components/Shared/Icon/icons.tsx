import User from "./Icons/User"
import Lock from "./Icons/Lock"
import UnLock from "./Icons/UnLock"
import Mail from "./Icons/Mail"
import Eye from "./Icons/Eye"
import Radar from "./Icons/Radar"
import EyeSlash from "./Icons/EyeSlash"
import Logout from "./Icons/Logout"

export const icons = {
  user: User,
  lock: Lock,
  unlock: UnLock,
  mail: Mail,
  eye: Eye,
  radar: Radar,
  logout: Logout,
  "eye-slash": EyeSlash,
}

export type IconName = keyof typeof icons
