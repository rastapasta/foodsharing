import { take, put, select, call } from 'redux-saga/effects'

import { getConversation, sendMessage } from '../common/api'
import { CONVERSATION_REQUEST, CONVERSATION_SUCCESS, MESSAGE_REQUEST, MESSAGE_SUCCESS } from '../common/constants'
import { actions as formActions } from 'react-redux-form'

export default function* conversationSaga() {
  while (true) {
    const { type, id, payload } = yield take([MESSAGE_REQUEST, CONVERSATION_REQUEST])

    switch (type) {
      case CONVERSATION_REQUEST:
        yield put({type: CONVERSATION_SUCCESS, id, payload: yield getConversation(id)})
        break

      case MESSAGE_REQUEST:
        const { conversationId } = payload
            , body = yield select(state => state.drafts[conversationId])
            , message = yield call(sendMessage, conversationId, body)

        yield put(formActions.change(`drafts.${conversationId}`, ''))
        yield put({type: MESSAGE_SUCCESS, id, payload: message})
        break
    }
  }
}