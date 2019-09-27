import { CONVERSATION_SUCCESS } from '../common/constants'

const initialState = {}

export default function reducer(state = initialState, action: any = {}) {
  switch (action.type) {
    case CONVERSATION_SUCCESS:
      const s = {...state}
          , {id, payload: {messages}} = action

      s[id] = messages
      return s

    default:
      return state
  }
}
