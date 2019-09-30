import { take, put, call, fork, select } from 'redux-saga/effects'

import { Platform } from 'react-native'
import PushNotificationIOS from '@react-native-community/push-notification-ios'
import AndroidBadge from 'react-native-android-badge'

import { getConversations } from '../common/api'

import {
  CONVERSATION_SUCCESS,
  CONVERSATIONS_REQUEST,
  CONVERSATIONS_SUCCESS,
  MESSAGE_SUCCESS,
  WEBSOCKET_MESSAGE
} from '../common/constants'

const countUnread = (conversations: any[]) =>
  conversations.reduce(
    (num, conversation) => num + (conversation.unread !== "0" ? 1 : 0),
    0
  )

// In case we are on iOS, update the unread messages counter of our homescreen icon
function* unreadWatcher() {
  while (true) {
    // Wait for all actions that could potentially alter the conversation
    yield take([CONVERSATIONS_SUCCESS, CONVERSATION_SUCCESS, MESSAGE_SUCCESS, WEBSOCKET_MESSAGE])

    // Get and count the number of unread conversations
    const conversations = yield select(state => state.conversations)
        , count = countUnread(conversations)

    console.log('setting badge count to ' + count)
    yield call(
      Platform.OS === 'ios' ?
        PushNotificationIOS.setApplicationIconBadgeNumber :
        AndroidBadge.setBadge
      ,
      count
    )
  }
}

function* fetch() {
  // Pull the conversations from the API
  const conversations = yield getConversations()

  // ... and publish it on the bus
  yield put({type: CONVERSATIONS_SUCCESS, payload: conversations})
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