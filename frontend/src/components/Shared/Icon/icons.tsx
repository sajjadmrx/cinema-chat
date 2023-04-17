import User from "./Icons/User"
import Lock from "./Icons/Lock"
import UnLock from "./Icons/UnLock"
import Mail from "./Icons/Mail"

export const icons = {
  user: User,
  lock: Lock,
  unlock: UnLock,
  mail: Mail,
}

export type IconName = keyof typeof icons
