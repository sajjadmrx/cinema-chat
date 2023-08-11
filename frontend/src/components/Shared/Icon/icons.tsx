import Copy from "./Icons/Copy"
import Eye from "./Icons/Eye"
import EyeSlash from "./Icons/EyeSlash"
import Lock from "./Icons/Lock"
import Logout from "./Icons/Logout"
import Mail from "./Icons/Mail"
import More from "./Icons/More"
import Radar from "./Icons/Radar"
import Send from "./Icons/Send"
import Trash from "./Icons/Trash"
import UnLock from "./Icons/UnLock"
import Undo from "./Icons/Undo"
import User from "./Icons/User"

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
