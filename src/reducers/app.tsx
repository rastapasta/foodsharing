import { TYPE as appState } from '../middlewares/AppState'
import { COOKIE } from '../common/constants'

const initialState = {
  state: null,
  session: null,
  token: null
}

export default function reducer(state = initialState, action: any = {}) {
  switch (action.type) {
    case appState:
      return {
        ...state,
        state: action.payload
      }

    case COOKIE:
      const mixin: any = {}

      if (action.name === 'PHPSESSID')
        mixin.session = action.value
      if (action.name === 'CSRF_TOKEN')
        mixin.token = action.value

      return {
        ...state,
        ...mixin
      }

    default:
      return state
  }
}
