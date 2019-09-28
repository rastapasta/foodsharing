import {
  PROFILE,
  LOGOUT
} from '../common/constants'

const initialState = {}

export default function reducer(state = initialState, action: any = {}) {
  const { type, payload } = action
  switch (type) {
    case PROFILE:
      return {...payload}

    case LOGOUT:
      return {...initialState}

    default:
      return state
  }
}
