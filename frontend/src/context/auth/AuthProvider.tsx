import { createContext, useReducer, useContext } from "react"
import authReduser from "./authReducer"
import { types } from "../../shared/interfaces/utils/contexts"
import { User } from "../../shared/interfaces/schemas/User.interface"

type Props = { children: React.ReactNode }

const initialState = {
  loading: true,
  user: null,
}

const initialValues = {
  loading: true,
  user: null,
  handleSetUser: (user: User) => {},
}

const AuthContext = createContext(initialValues)

export const AuthProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(authReduser, initialState)

  const { loading, user } = state

  const handleSetUser = (user: User) => {
    dispatch({ type: types.SET_USER, payload: user })
  }

  const value = {
    loading,
    user,
    handleSetUser,
  }

  return <AuthContext.Provider value={value} children={children} />
}

export const useAuth = () => useContext(AuthContext)
