export interface User {
  userId: number
  email: string
  username: string
  permissions: string[]
  createdAT: string
  updateAT: string
}
export interface UserContext {
  loading: boolean
  user: User | null
  handleSetUser: any
}
