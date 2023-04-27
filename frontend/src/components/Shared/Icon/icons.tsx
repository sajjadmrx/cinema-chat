import User from "./Icons/User"
import Lock from "./Icons/Lock"
import UnLock from "./Icons/UnLock"
import Mail from "./Icons/Mail"
import Eye from "./Icons/Eye"
import Radar from "./Icons/Radar"
import EyeSlash from "./Icons/EyeSlash"
import Logout from "./Icons/Logout"
import Send from "./Icons/Send"
import More from "./Icons/More"
import Trash from "./Icons/Trash"
import Copy from "./Icons/Copy"
import Undo from "./Icons/Undo"

export const icons = {
  user: User,
  lock: Lock,
  unlock: UnLock,
  mail: Mail,
  eye: Eye,
  radar: Radar,
  logout: Logout,
  send: Send,
  more: More,
  trash: Trash,
  copy: Copy,
  undo: Undo,
  "eye-slash": EyeSlash,
}

export type IconName = keyof typeof icons
