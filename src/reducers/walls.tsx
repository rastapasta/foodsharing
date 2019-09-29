import {
  WALL_SUCCESS
} from '../common/constants'

const initialState = {
  fairteiler: {},
  foodsharer: {}
}

export default function reducer(state = initialState, action: any = {}) {
  switch (action.type) {
    case WALL_SUCCESS:
      const newState = {...state}
      //     , { payload } = action

      // newState[payload.id] = {...payload}
      return newState

    default:
      return state
  }
}
