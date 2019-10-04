import {
  PROFILE,
  LOGOUT,
  LOGIN_SUCCESS
} from '../common/constants'

const initialState = {}

export default function reducer(state = initialState, action: any = {}) {
  const { type, payload } = action
  switch (type) {
    case PROFILE:
      return {...payload}

    case LOGIN_SUCCESS:
        return {...state, ...(payload.id ? {id: payload.id} : {})}

    case LOGOUT:
      return {...initialState}

    default:
      return state
  }
}
