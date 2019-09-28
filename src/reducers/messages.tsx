import { CONVERSATION_SUCCESS, MESSAGE_SUCCESS } from '../common/constants'

const initialState = {}

export default function reducer(state = initialState, action: any = {}) {

  switch (action.type) {
    case CONVERSATION_SUCCESS:
      const convState = {...state}
          , {id, payload: {messages}} = action

      convState[id] = messages
      return convState

    case MESSAGE_SUCCESS:
      const msgState = {...state}
          , {conversationId, payload} = action

      msgState[conversationId].unshift(payload)
      return msgState

    default:
      return state
  }
}
