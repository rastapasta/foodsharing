import {
  WALL_SUCCESS
} from '../common/constants'

const initialState = {
  fairteiler: {},
  foodsaver: {}
}

export default function reducer(state = initialState, action: any = {}) {
  switch (action.type) {
    case WALL_SUCCESS:
      const newState = {...state}
        , { payload, target, id } = action

      newState[target][`${id}`] = payload
      return newState

    default:
      return state
  }
}
