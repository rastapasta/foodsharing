import {
  CONVERSATION_SUCCESS,
  MESSAGE_SUCCESS,
  WEBSOCKET_MESSAGE,
  LOGOUT
} from '../common/constants'

const initialState = {}

const replaceOrUnshift = (arr: any[], message: any) =>
  [message, ...(arr || []).filter(msg => msg.id !== message.id)]

export default function reducer(state = initialState, action: any = {}) {
  const { type, payload } = action
  switch (type) {
    case CONVERSATION_SUCCESS:
      const convState = {...state}
          , {id } = action
          , { messages } = payload
          , previous = convState[`${id}`] || []

          // Convert to object
          , id2msg = previous.reduce((all, cur) => {all[cur.id] = cur; return all}, {})

      // Merge in the new message to our existing store
      messages.forEach(message =>
        id2msg[message.id] = {...(id2msg[message.id] || {}), ...message}
      )

      convState[`${id}`] = Object.keys(id2msg).map(id => id2msg[id]).sort((a, b) => b.id - a.id)
      return convState

    case MESSAGE_SUCCESS:
    case WEBSOCKET_MESSAGE:
      const msgState = {...state}
          , conversationId = type === MESSAGE_SUCCESS ? action.conversationId : payload.cid
          , idx = `${conversationId}`

      msgState[idx] = replaceOrUnshift(msgState[idx], payload)
      return msgState

    case LOGOUT:
      return {...initialState}

    default:
      return state
  }
}
