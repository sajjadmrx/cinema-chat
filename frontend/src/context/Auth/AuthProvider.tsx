import { createContext, useContext, useEffect } from "react"
import { useReducerAsync } from 'use-reducer-async'

import { User } from "@/types/schemas/User.schema"
import { types } from "@/types/utils/providers"
import { authReducer, asyncActionHandlers } from "./authReducer"

const initialState = {
  loading: true,
  error: null,
  user: null,
}

const AuthContext = createContext(initialState)
const AuthContextDispacher = createContext({})

export const AuthProvider = ({ children }) => {
  const [user, dispatch] = useReducerAsync(authReducer, initialState, asyncActionHandlers)

  useEffect(() => {
    dispatch({ type: types.LOAD_USER })
  }, [])

  return (
    <AuthContext.Provider value={user}>
      <AuthContextDispacher.Provider value={dispatch} children={children} />
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
export const useAuthActions = () => useContext(AuthContextDispacher)
