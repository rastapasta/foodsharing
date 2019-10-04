import {
  BACKGROUND_STATE,
  LOGIN_SUCCESS,
  LOGOUT,
  NAVIGATION,
  CONNECTION_STATUS,
  LOGIN_REQUEST,
  LOGIN_ERROR,
  REQUEST_ERROR
} from '../common/constants'

const initialState = {
  background: false,
  online: false,
  session: null,
  token: null,
  scene: null,
  authenticating: null
}

export default function reducer(state = initialState, action: any = {}) {
  const { type, payload } = action
  switch (type) {
    case REQUEST_ERROR:
      return state.authenticating ? {
        ...state,
        authenticating: false
      } : state

    case LOGIN_REQUEST:
      return {
        ...state,
        authenticating: true
      }

    case LOGIN_ERROR:
      return {
        ...state,
        authenticating: false
      }

    case BACKGROUND_STATE:
      return {
        ...state,
        background: payload
      }

    case NAVIGATION:
      return {
        ...state,
        ...payload
      }

    case LOGIN_SUCCESS:
      const { session, token } = payload
      return {
        ...state,
        session,
        token,
        authenticating: null
      }

    case LOGOUT:
      return {
        ...state,
        session: null,
        token: null,
        authenticating: null
      }

    case CONNECTION_STATUS:
      return {
        ...state,
        online: payload
      }

    default:
      return state
  }
}
