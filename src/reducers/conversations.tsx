import { CONVERSATIONS_SUCCESS } from '../common/constants'

const initialState = []

export default function reducer(state = initialState, action: any = {}) {
  switch (action.type) {
    case CONVERSATIONS_SUCCESS:
      return action.payload.map(conversation => ({
        ...conversation,
        member: conversation.member.map(member => member.id)
      }))

    default:
      return state
  }
}
