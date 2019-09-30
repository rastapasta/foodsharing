import {
  CONVERSATION_SUCCESS,
  CONVERSATIONS_SUCCESS,
  LOGOUT
} from '../common/constants'

const initialState = {}

export default function reducer(state = initialState, action: any = {}) {
  const { type, payload } = action

  switch (type) {
    case CONVERSATION_SUCCESS:
    case CONVERSATIONS_SUCCESS:
      const convState = state
          , members = type === CONVERSATION_SUCCESS ? payload.members :
                      type === CONVERSATIONS_SUCCESS ? payload.reduce(
                        (all, conversation) => all.concat(conversation.member),
                        []
                      ) : []

      members.forEach(member => {
        const key = `${member.id}`

        if (member.avatar) {
          member.photo = member.avatar
          delete member.avatar
        }
        if (member.infomail_message)
          delete member.infomail_message

        convState[key] = {
          ...(convState[key] || {}),
          ...member
        }
      })
      return convState

    case LOGOUT:
      return {...initialState}

    default:
      return state
  }
}
