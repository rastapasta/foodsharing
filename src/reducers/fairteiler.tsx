import {
  FAIRTEILER_SUCCESS
} from '../common/constants'

const initialState = {}

export default function reducer(state = initialState, action: any = {}) {
  switch (action.type) {
    case FAIRTEILER_SUCCESS:
      const newState = {...state}
          , { payload } = action

      newState[payload.id] = {...payload}
      return newState

    default:
      return state
  }
}
