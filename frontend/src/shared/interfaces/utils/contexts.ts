export enum Types {
  SET_USER = "SET_USER",
}

export interface ActionProps {
  type: string
  payload?: any
  error?: any
}
