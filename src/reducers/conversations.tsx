import { CONVERSATIONS_SUCCESS } from '../constants'

const initialState = []

export default function reducer(state = initialState, action: any = {}) {
  switch (action.type) {
    case CONVERSATIONS_SUCCESS:
      return action.payload

    default:
      return state
  }
}
