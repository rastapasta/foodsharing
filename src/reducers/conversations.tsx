import {
  MESSAGE_SUCCESS,
  MESSAGE_READ,
  WEBSOCKET_MESSAGE,
  CONVERSATION_SUCCESS,
  CONVERSATIONS_SUCCESS,
  LOGOUT
} from '../common/constants'
import { MessageType } from '../common/typings'

const initialState = []
    , messageToObj = message => ({
      unread: message.type === MessageType.RECEIVED ? "1" : "0",
      last_foodsaver_id: `${message.fs_id}`,
      last_message: message.body,
      last: message.time,
      last_ts: Math.floor(Date.parse(message.time)/1000).toString()
    })

export default function reducer(state = initialState, action: any = {}) {
  switch (action.type) {
    // Process a sucessful conversations request
    case CONVERSATIONS_SUCCESS:
      return action.payload.map(conversation => ({
        ...conversation,
        member: conversation.member.map(member => member.id)
      }))

    // Mark a conversation as read as soon as we pulled its latest messages
    case MESSAGE_READ:
    case CONVERSATION_SUCCESS:
      const id = action.type === CONVERSATION_SUCCESS ? action.id : action.payload

      return state.map(conversation => {
        if (conversation.id != id)
          return conversation

        return {
          ...conversation,
          unread: "0"
        }
      })

    // Process incoming messages by updating the last conversations last timestamp, user and
    // create conversation in case it didnt exist yet
    case MESSAGE_SUCCESS:
    case WEBSOCKET_MESSAGE:
      const { payload: {fs_id, cid} } = action
          , conversationId = action.type === MESSAGE_SUCCESS ? action.conversationId : cid

      let found = false

      const newState = state.map(conversation => {
        if (conversation.id != conversationId)
          return conversation

        found = true
        return {
          ...conversation,
          ...messageToObj(action.payload)
        }
      })

      // In case this is an fresh conversation that we don't have yet, create it!
      if (!found)
        newState.push({
          id: conversationId,
          member: [`${fs_id}`],
          ...messageToObj(action.payload)
        })

      return newState

    // Destroy our conversations from store in case the user logs out
    case LOGOUT:
      return [...initialState]

    default:
      return state
  }
}
