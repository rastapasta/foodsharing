import {
  CONVERSATION_SUCCESS,
  CONVERSATIONS_SUCCESS,

  CONVERSATION_ID_REQUEST,
  CONVERSATION_ID_SUCCESS,

  REPORT_REQUEST,
  REPORT_SUCCESS,

  PROFILE_REQUEST,
  PROFILE_SUCCESS,

  FRIENDSHIP_REQUEST,
  FRIENDSHIP_SUCCESS,
  LOGOUT
} from '../common/constants'

const initialState = {}

const mergeWithState = (state, id, options) => {
  const newState = {...state}
      , key = `${id}`

  newState[key] = {
    ...state[key],
    ...options
  }

  return newState
}

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

    case PROFILE_REQUEST:
      return mergeWithState(state, payload, {
        loading: true
      })

    case PROFILE_SUCCESS:
      const profileState = {...state}
          , key = `${payload.id}`
          , { bananas } = payload

      profileState[key] = {
        ...profileState[key],
        ...payload,
        loading: false
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
      return mergeWithState(state, payload, {
        friendrequestLoading: true
      })

    case FRIENDSHIP_SUCCESS:
      return mergeWithState(state, payload, {
        isFriend: true,
        friendrequestLoading: false
      })

    case CONVERSATION_ID_REQUEST:
      return mergeWithState(state, payload, {
        conversationIdLoading: true
      })

    case CONVERSATION_ID_SUCCESS:
      return mergeWithState(state, action.id, {
        conversationIdLoading: false
      })

    case REPORT_REQUEST:
      return mergeWithState(state, payload.userId, {
        reportSending: true
      })

    case REPORT_SUCCESS:
      return mergeWithState(state, payload, {
        reportSending: false,
        reported: true
      })

    case LOGOUT:
      return {...initialState}

    default:
      return state
  }
}
