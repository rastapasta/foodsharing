import { take, put } from 'redux-saga/effects'

import { getConversations } from '../common/api'
import { CONVERSATIONS_REQUEST, CONVERSATIONS_SUCCESS } from '../common/constants'

export default function* conversationsSaga() {
  while (true) {
    // Wait until we get a conversation request
    yield take(CONVERSATIONS_REQUEST)

    // Pull the conversations from the API
    const conversations = yield getConversations()

    // ... and publish it on the bus
    yield put({type: CONVERSATIONS_SUCCESS, payload: conversations})
  }
}