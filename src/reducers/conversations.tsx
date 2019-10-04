import {
  MESSAGE_REQUEST,
  MESSAGE_SUCCESS,
  MESSAGE_READ,
  WEBSOCKET_MESSAGE,
  CONVERSATION_SUCCESS,
  CONVERSATIONS_SUCCESS,
  LOGOUT,
  CONVERSATION_ID_SUCCESS,
  CONVERSATION_REQUEST,
  REQUEST_ERROR
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
  const { type, payload } = action
  switch (type) {
    // Process a sucessful conversations request
    case CONVERSATIONS_SUCCESS:
      return payload.map(conversation => ({
        ...conversation,
        member: conversation.member.map(member => member.id)
      }))

    case CONVERSATION_REQUEST:
      return state.map(conversation => {
        if (conversation.id != payload.id)
          return conversation

        return {
          ...conversation,
          loading: true
        }
      })

    // Mark a conversation as not loading anymore or read as soon as
    // we pulled its latest messages
    case MESSAGE_READ:
    case CONVERSATION_SUCCESS:
      const id = type === CONVERSATION_SUCCESS ? action.id : payload

      let exists = false
      const freshState = state.map(conversation => {
        if (conversation.id != id)
          return conversation

        exists = true
        return {
          ...conversation,
          unread: "0",
          loading: false,
          ...(type === CONVERSATION_SUCCESS && payload.messages.length <= 5 ? {fullyLoaded: true} : {})
        }
      })

      // Push the conversation into our mailbox - happens for freshly initiated conversations
      if (type === CONVERSATION_SUCCESS && exists === false)
        freshState.push({
          id,
          ...payload,
          member: payload.member.map(member => member.id)
        })

      return freshState

    // Set this conversations sending state
    case MESSAGE_REQUEST:
      return state.map(conversation => {
        if (conversation.id != payload.conversationId)
          return conversation

        return {
          ...conversation,
          sending: true
        }
      })

    // Process incoming me\ssages by updating the last conversations last timestamp, user and
    // create conversation in case it didnt exist yet
    case MESSAGE_SUCCESS:
    case WEBSOCKET_MESSAGE:
      const { payload: {fs_id, cid} } = action
          , conversationId = type === MESSAGE_SUCCESS ? action.conversationId : cid

      let found = false
      const newState = state.map(conversation => {
        if (conversation.id != conversationId)
          return conversation

        found = true
        return {
          ...conversation,
          ...messageToObj(payload),
          ...(type === MESSAGE_SUCCESS ? {sending: false} : {})
        }
      })

      // In case this is an fresh conversation that we don't have yet, create it!
      if (!found)
        newState.push({
          id: conversationId,
          member: [`${fs_id}`],
          ...messageToObj(payload)
        })

      return newState

    case CONVERSATION_ID_SUCCESS:
      // Prepare for an soon to be navigated to conversation
      if (state.find(conversation => conversation.id == payload))
        return state

      return [
        ...state,
        {
          id: payload,
          member: [`${action.id}`],
          message: []
        }
      ]

    // In case we get any request error, reset all our sending states
    // TODO: might be optimizable to not spread the full conversations
    case REQUEST_ERROR:
      return state.map(conversation => ({
        ...conversation,
        sending: false
      }))

    // Destroy our conversations from store in case the user logs out
    case LOGOUT:
      return [...initialState]

    default:
      return state
  }
}
