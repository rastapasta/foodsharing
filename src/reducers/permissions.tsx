import { TYPE as appState } from '../middlewares/AppState'

const initialState = {
  appstate: null,
}

export default function reducer(state = initialState, action: any = {}) {
  switch (action.type) {
    case appState:
      return {
        ...state,
        appstate: action.payload
      }

    default:
      return state
  }
}
