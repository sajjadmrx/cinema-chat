import Router from "next/router"
import { toast } from "react-hot-toast"

import * as authService from "@/services/auth.service"
import { ActionProps, types } from "@/types/utils/providers"

const initialState = {
  loading: true,
  error: null,
  user: null,
}

export const authReducer = (state = initialState, action: ActionProps) => {
  switch (action.type) {
    case types.SIGNIN_PENDING:
      return { user: null, error: null, loading: true }
    case types.SIGNIN_SUCCESS:
      return { loading: false, error: null, user: action.payload }
    case types.SIGNIN_REJECT:
      return { error: action.error, loading: false, user: null }
    default:
      return { ...state }
  }
}

export const asyncActionHandlers = {
  SIGNUP:
    ({ dispatch }) =>
    async (action: any) => {
      dispatch({ type: types.SIGNIN_PENDING })
      const res = await authService.signUpUser(action.payload)

      if (res.success) {
        toast.success("Your account has been successfully created")
        dispatch({ type: types.SIGNIN_SUCCESS, payload: res.token })
        Router.push("/")
      } else {
        dispatch({ type: types.SIGNIN_REJECT, error: res.error })
        const userAlreadyExists = res.error.response.data.message === "USER_EXISTS"
        const serverError = res.error.response.data.message === "SERVER_ERROR"

        toast.dismiss()
        if (userAlreadyExists) toast.error("User already exists")
        if (serverError) toast.error("There is a problem on the server side")
      }
    },
  SIGNIN:
    ({ dispatch }) =>
    async (action: any) => {
      dispatch({ type: types.SIGNIN_PENDING })
      const res = await authService.logInUser(action.payload)

      if (res.success) {
        toast.success("Login was successful!")
        localStorage.setItem("token", res.token)
        dispatch({ type: types.SIGNIN_SUCCESS, payload: res.token })
        Router.push("/")
      } else {
        dispatch({ type: types.SIGNIN_REJECT, error: res.error })

        const invalidUsernamePassword =
          res.error.response.data.message === "INVALID_USERNAME_PASSWORD"
        const serverError = res.error.response.data.message === "SERVER_ERROR"

        toast.dismiss()
        if (invalidUsernamePassword) toast.error("Username or password is incorrect")
        if (serverError) toast.error("There is a problem on the server side")
      }
    },
  LOAD_USER:
    ({ dispatch }) =>
    async (action: any) => {
      dispatch({ type: types.SIGNIN_PENDING })
      const res = await authService.getCurrentUser()
      if (res.success) {
        dispatch({ type: types.SIGNIN_SUCCESS, payload: res.user })
      } else {
        dispatch({ type: types.SIGNIN_REJECT, error: res.error })
      }
    },
  SIGNOUT:
    ({ dispatch }) =>
    (action: any) => {
      window.location.href = "/"
    },
}
