import { CONVERSATION_SUCCESS, WEBSOCKET_MESSAGE } from '../common/constants'

const initialState = {}

export default function reducer(state = initialState, action: any = {}) {
  const { type, payload } = action
  switch (type) {
    case CONVERSATION_SUCCESS:
      const convState = {...state}
          , {id } = action
          , { messages } = payload

      convState[`${id}`] = messages
      return convState

    // TODO: Could either store message locally or wait for it via websocket - maybe both :)
    // case MESSAGE_SUCCESS:
    //   const msgState = {...state}
    //       , { conversationId } = action

    //   msgState[`${conversationId}`].unshift(payload)
    //   return msgState

    case WEBSOCKET_MESSAGE:
      const socketState = {...state}
          , { cid } = payload

      if (!socketState[`${cid}`])
        socketState[`${cid}`] = []

      socketState[`${cid}`].unshift(payload)
      return socketState

    default:
      return state
  }
}
