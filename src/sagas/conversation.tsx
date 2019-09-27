import { take, put } from 'redux-saga/effects'

import { getConversation } from '../common/api'
import { CONVERSATION_REQUEST, CONVERSATION_SUCCESS } from '../common/constants'

function* conversationsSaga() {
  while (true) {
    const { id } = yield take(CONVERSATION_REQUEST)

    const conversation = yield getConversation(id)

    yield put({type: CONVERSATION_SUCCESS, id, payload: conversation})
  }
}

export default conversationsSaga