import { take, put, call, fork } from 'redux-saga/effects'

import { Platform } from 'react-native'
import PushNotificationIOS from '@react-native-community/push-notification-ios'

import { getConversations } from '../common/api'

import { CONVERSATIONS_REQUEST, CONVERSATIONS_SUCCESS } from '../common/constants'

const countUnread = (conversations: any[]) =>
  conversations.reduce(
    (num, conversation) => num + (conversation.unread !== "0" ? 1 : 0),
    0
  )

function* fetch() {
  // Pull the conversations from the API
  const conversations = yield getConversations()

  // In case we are on iOS, update the unread messages counter of our homescreen icon
  if (Platform.OS === 'ios')
    yield call(PushNotificationIOS.setApplicationIconBadgeNumber, countUnread(conversations))

  // ... and publish it on the bus
  yield put({type: CONVERSATIONS_SUCCESS, payload: conversations})
}

export default function* conversationsSaga() {
  while (true) {
    // Wait until we get a conversation request
    yield take(CONVERSATIONS_REQUEST)
    yield fork(fetch)
  }
}