import { take, put, call, fork, select } from 'redux-saga/effects'

import { AllHtmlEntities } from 'html-entities'

import { Platform } from 'react-native'
import PushNotificationIOS from '@react-native-community/push-notification-ios'
import AndroidBadge from 'react-native-android-badge'

import { getConversations, markAsRead, userToConversationId } from '../api'

import {
  CONVERSATION_SUCCESS,
  CONVERSATION_ID_REQUEST,

  CONVERSATIONS_REQUEST,
  CONVERSATIONS_SUCCESS,
  MESSAGE_SUCCESS,
  MESSAGE_READ,
  WEBSOCKET_MESSAGE,
  CONVERSATION_ID_SUCCESS
} from '../common/constants'

import { MessageType } from '../common/typings'
import { Actions } from 'react-native-router-flux'

const entities = new AllHtmlEntities()
    ,countUnread = (conversations: any[]) =>
      conversations.reduce(
        (num, conversation) => num + (conversation.unread !== "0" ? 1 : 0),
        0
      )

function* fetch() {
  try {
    // Pull the conversations from the API
    const conversations = yield getConversations()

    // Decode HTML entities before the content gets into the hands of any other method
    for (const conversation of conversations)
      conversation.last_message = entities.decode(conversation.last_message)

    // ... and publish it on the bus
    yield put({
      type: CONVERSATIONS_SUCCESS,
      payload: conversations
    })
  } catch(e) {/* Errors are handled via Redux reducers */}
}


export default function* conversationsSaga() {
  // Wait for message read actions and mark conversations as read
  yield fork(markAsReadWatcher)

  // Wait for and handle userid->conversation requests
  yield fork(conversationIdResolver)

  // Wait for actions altering the conversations undread counter
  yield fork(unreadWatcher)

  // Wait for an incoming WebSocket message to a unknown conversation
  yield fork(unknownWatcher)

  while (true) {
    // Wait until we get a conversation request
    yield take(CONVERSATIONS_REQUEST)
    yield fork(fetch)
  }
}

// Wait for message read actions and mark conversations as read
function* conversationIdResolver() {
  while (true) {
    const { payload: id } = yield take(CONVERSATION_ID_REQUEST)
        , conversations = yield select(state => state.conversations)
        , conversation = conversations.find(conversation =>
            conversation.member.length === 2 &&
            conversation.member.find(member => member == id)
          )
        , conversationId = conversation ? conversation.id : yield userToConversationId(id)

    yield put({type: CONVERSATION_ID_SUCCESS, id, payload: conversationId})
    Actions.push('conversation', {conversationId})
  }
}

// Wait for message read actions and mark conversations as read
function* markAsReadWatcher() {
  while (true) {
    const { payload: id } = yield take(MESSAGE_READ)
    yield markAsRead(id)
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
      if (action.payload.type === MessageType.RECEIVED && scene === 'conversation' && sceneId == action.payload.cid)
        yield put({type: MESSAGE_READ, payload: action.payload.cid})
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


// Wait for an incoming WebSocket message to a unknown conversation
function* unknownWatcher() {
  while (true) {
    const { payload: { cid } } = yield take(WEBSOCKET_MESSAGE)
        , conversations = yield select(state => state.conversations)
        , conversation = conversations.find(conversation => conversation.id == cid)

    // In case we don't know the conversation yet, pull it, to make sure to get all members
    if (!conversation)
      yield put({type: CONVERSATIONS_REQUEST})
  }
}