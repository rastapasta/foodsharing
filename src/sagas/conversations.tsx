import { take, put } from 'redux-saga/effects'

import { getConversations } from '../utils/api'
import { CONVERSATIONS_REQUESTING, CONVERSATIONS_SUCCESS } from '../constants'

function* conversationsSaga() {
  while (true) {
    yield take(CONVERSATIONS_REQUESTING)

    const conversations = yield getConversations()

    yield put({type: CONVERSATIONS_SUCCESS, payload: conversations})
  }
}

export default conversationsSaga