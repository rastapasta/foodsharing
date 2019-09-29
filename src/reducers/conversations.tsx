import {
  MESSAGE_SUCCESS,
  WEBSOCKET_MESSAGE,
  CONVERSATIONS_SUCCESS,
  LOGOUT
} from '../common/constants'

const initialState = []

export default function reducer(state = initialState, action: any = {}) {
  switch (action.type) {
    case MESSAGE_SUCCESS:
    case WEBSOCKET_MESSAGE:
      const { payload: {time, fs_id, body, cid} } = action
          , conversationId = action.type === MESSAGE_SUCCESS ? action.conversationId : cid

      return state.map(conversation => {
        if (conversation.id != conversationId)
          return {...conversation}

        return {
          ...conversation,
          last_foodsaver_id: `${fs_id}`,
          last_message: body,
          last: time,
          last_ts: Math.floor(Date.parse(time)/1000)
        }
      })

    case CONVERSATIONS_SUCCESS:
      return action.payload.map(conversation => ({
        ...conversation,
        member: conversation.member.map(member => member.id)
      }))

    case LOGOUT:
      return [...initialState]

    default:
      return state
  }
}
