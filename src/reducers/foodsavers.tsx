import {
  CONVERSATION_SUCCESS,
  CONVERSATIONS_SUCCESS,

  CONVERSATION_ID_REQUEST,
  CONVERSATION_ID_SUCCESS,

  PROFILE_SUCCESS,
  FRIENDSHIP_REQUEST,
  FRIENDSHIP_SUCCESS,
  LOGOUT
} from '../common/constants'

const initialState = {}

export default function reducer(state = initialState, action: any = {}) {
  const { type, payload } = action

  switch (type) {
    case CONVERSATION_SUCCESS:
    case CONVERSATIONS_SUCCESS:
      const convState = {...state}
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

    case PROFILE_SUCCESS:
      const profileState = {...state}
          , key = `${payload.id}`
          , { bananas } = payload

      profileState[key] = {
        ...profileState[key],
        ...payload
      }

      // Inject all foodsavers who gave a banana
      bananas.forEach(({fs_id, fs_name, fs_photo}) => {
        profileState[`${fs_id}`] = {
          ...(profileState[`${fs_id}`] || {}),
          name: fs_name,
          photo: fs_photo,
          id: fs_id
        }
      })

      return profileState

    case FRIENDSHIP_REQUEST:
      const friendState = {...state}
      friendState[`${payload}`].friendrequestLoading = true
      return friendState

    case FRIENDSHIP_SUCCESS:
      const friendshipState = {...state}
      friendshipState[`${payload}`].isFriend = true
      friendshipState[`${payload}`].friendrequestLoading = false
      return friendshipState

    case CONVERSATION_ID_REQUEST:
      const idRequestState = {...state}
      idRequestState[`${payload}`].conversationIdLoading = true
      return idRequestState

    case CONVERSATION_ID_SUCCESS:
      const idSuccessState = {...state}
      idSuccessState[`${action.id}`].conversationIdLoading = false
      return idSuccessState

    case LOGOUT:
      return {...initialState}

    default:
      return state
  }
}
