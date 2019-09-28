import { CONVERSATION_SUCCESS, CONVERSATIONS_SUCCESS } from '../common/constants'

const initialState = {}

export default function reducer(state = initialState, action: any = {}) {
  const { type, payload } = action
  switch (type) {
    case CONVERSATION_SUCCESS:
    case CONVERSATIONS_SUCCESS:
      const convState = {...state}
          , members = CONVERSATION_SUCCESS ? payload.members :
                      CONVERSATIONS_SUCCESS ? payload.reduce(
                        (all, conversation) => all.concat(conversation.member),
                        []
                      ) : []

      members.forEach(member => {
        const key = `${member.id}`
        convState[key] = {
          ...(convState[key] || {}),
          ...member
        }
      })
      return convState

    default:
      return state
  }
}
