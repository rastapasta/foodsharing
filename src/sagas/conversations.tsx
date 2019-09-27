import { take, put } from 'redux-saga/effects'

import { getConversations } from '../utils/api'
import { CONVERSATIONS_REQUEST, CONVERSATIONS_SUCCESS } from '../constants'

function* conversationsSaga() {
  while (true) {
    yield take(CONVERSATIONS_REQUEST)

    const conversations = yield getConversations()

    yield put({type: CONVERSATIONS_SUCCESS, payload: conversations})
  }
}

export default conversationsSaga