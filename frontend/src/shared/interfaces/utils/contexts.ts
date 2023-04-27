export enum types {
  SIGNIN_PENDING = "SIGNIN_PENDING",
  SIGNIN_REJECT = "SIGNIN_REJECT",
  SIGNIN_SUCCESS = "SIGNIN_SUCCESS",

  LOAD_USER = "LOAD_USER",
  SIGNOUT = "SIGNOUT",
}

export interface ActionProps {
  type: string
  payload?: any
  error?: any
}
