import { ActionProps, Types } from "../../shared/interfaces/utils/contexts"

const initialState = {
  loading: true,
  user: null,
}

const authReducer = (state = initialState, action: ActionProps) => {
  const { type, payload } = action

  switch (type) {
    case Types.SET_USER:
      return { ...state, user: payload }
    default:
      return state
  }
}

export default authReducer
