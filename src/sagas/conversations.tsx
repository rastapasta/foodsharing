import { take, put, call, fork, select } from 'redux-saga/effects'

import { AllHtmlEntities } from 'html-entities'

import { Platform } from 'react-native'
import PushNotificationIOS from '@react-native-community/push-notification-ios'
import AndroidBadge from 'react-native-android-badge'

import { getConversations, markAsRead } from '../common/api'

import {
  CONVERSATION_SUCCESS,
  CONVERSATIONS_REQUEST,
  CONVERSATIONS_SUCCESS,
  MESSAGE_SUCCESS,
  WEBSOCKET_MESSAGE
} from '../common/constants'

const entities = new AllHtmlEntities()
    ,countUnread = (conversations: any[]) =>
      conversations.reduce(
        (num, conversation) => num + (conversation.unread !== "0" ? 1 : 0),
        0
      )

function* fetch() {
  // Pull the conversations from the API
  const conversations = yield getConversations()

  // ... and publish it on the bus
  yield put({
    type: CONVERSATIONS_SUCCESS,
    payload: conversations.map(conversation => ({
      ...conversation,
      last_message: entities.decode(conversation.last_message)
    }))
  })
}

export default function* conversationsSaga() {
  // Wait for actions altering the conversations undread counter
  yield fork(unreadWatcher)

  while (true) {
    // Wait until we get a conversation request
    yield take(CONVERSATIONS_REQUEST)
    yield fork(fetch)
  }
}

// In case we are on iOS, update the unread messages counter of our homescreen icon
function* unreadWatcher() {
  while (true) {
    // Wait for all actions that could potentially alter the conversation
    const action = yield take([CONVERSATIONS_SUCCESS, CONVERSATION_SUCCESS, MESSAGE_SUCCESS, WEBSOCKET_MESSAGE])

    // Mark message as read in case the conversation is currently open
    if (action.type === WEBSOCKET_MESSAGE) {
      const {scene, sceneId} = yield select(state => state.app)
      if (scene === 'conversation' && sceneId == action.payload.cid)
        yield markAsRead(action.payload.cid)
    }

    // Get and count the number of unread conversations
    const conversations = yield select(state => state.conversations)
        , count = countUnread(conversations)

    // Set the badge count depending on the relevant bridge
    yield call(
      Platform.OS === 'ios' ?
        PushNotificationIOS.setApplicationIconBadgeNumber :
        AndroidBadge.setBadge,
      count
    )
  }
}
