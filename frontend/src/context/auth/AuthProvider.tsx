import React from "react"
import { createContext, useReducer, useContext } from "react"
import authReducer from "./authReducer"
import { Types } from "../../shared/interfaces/utils/contexts"
import { User, UserContext } from "@interfaces/schemas/User.interface"
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

const AuthContext = createContext<UserContext>(initialValues)

export const AuthProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  const { loading, user } = state
  const handleSetUser = (user: User) => {
    dispatch({ type: Types.SET_USER, payload: user })
  }

  const value = {
    loading,
    user,
    handleSetUser,
  }

  return <AuthContext.Provider value={value} children={children} />
}

export const useAuth = () => useContext<UserContext>(AuthContext)
