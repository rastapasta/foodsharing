import { take, put, select, call, fork } from 'redux-saga/effects'
import { AllHtmlEntities } from 'html-entities'
import { actions as formActions } from 'react-redux-form'

import { getConversation, sendMessage } from '../common/api'
import {
  CONVERSATION_REQUEST,
  CONVERSATION_SUCCESS,
  MESSAGE_REQUEST,
  MESSAGE_SUCCESS
} from '../common/constants'

const entities = new AllHtmlEntities()

function* fetch(id: number) {
  yield put({
    type: CONVERSATION_SUCCESS,
    id,
    payload: (yield getConversation(id)).map(conversation => ({
      ...conversation,
      body: entities.decode(conversation.body)
    }))
  })
}

export default function* conversationSaga() {
  while (true) {
    // Wait until we get either a message or conversation request
    const { type, id, payload } = yield take([MESSAGE_REQUEST, CONVERSATION_REQUEST])

    switch (type) {
      // Request the corresponding conversation from the backend
      case CONVERSATION_REQUEST:
        yield fork(fetch, id)
        break

      // Send out a message to a given conversation
      case MESSAGE_REQUEST:
        const { conversationId } = payload
            , body = yield select(state => state.drafts[conversationId])
            , message = yield call(sendMessage, conversationId, body)

        // Reset the drafted message
        yield put(formActions.change(`drafts.${conversationId}`, ''))

        // Notifiy about the successful send over the bus
        yield put({type: MESSAGE_SUCCESS, conversationId, payload: message})
        break
    }
  }
}