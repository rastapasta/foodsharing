import { take, put, select, call, fork } from 'redux-saga/effects'
import { AllHtmlEntities } from 'html-entities'
import { actions as formActions } from 'react-redux-form'

import { getConversation, sendMessage } from '../api'

import {
  CONVERSATION_REQUEST,
  CONVERSATION_SUCCESS,
  MESSAGE_REQUEST,
  MESSAGE_SUCCESS
} from '../common/constants'
import { MessageType } from '../common/typings'

const entities = new AllHtmlEntities()

function* fetch(id: number, offset: number) {
  try {
    const conversation = yield getConversation(id, offset)
        , ownId = yield select(state => state.profile.id)

    // Decode HTML entities before the content gets into the hands of any other method
    conversation.messages.forEach(message => {
      message.body = entities.decode(message.body)
      message.type = message.fs_id === ownId ? MessageType.SENT : MessageType.RECEIVED
    })

    yield put({
      type: CONVERSATION_SUCCESS,
      id,
      offset,
      payload: conversation
    })

  } catch(e) {/* Errors are handled via Redux reducers */}
}

export default function* conversationSaga() {
  while (true) {
    // Wait until we get either a message or conversation request
    const { type, payload } = yield take([MESSAGE_REQUEST, CONVERSATION_REQUEST])

    switch (type) {
      // Request the corresponding conversation from the backend
      case CONVERSATION_REQUEST:
        yield fork(fetch, payload.id, payload.offset)
        break

      // Send out a message to a given conversation
      case MESSAGE_REQUEST:
        try {
          const { conversationId } = payload
              , body = yield select(state => state.drafts[conversationId])
              , message = yield call(sendMessage, conversationId, body)

          // Reset the drafted message
          yield put(formActions.change(`drafts.${conversationId}`, ''))

          // Notifiy about the successful send over the bus
          yield put({type: MESSAGE_SUCCESS, conversationId, payload: {
            ...message,
            body: entities.decode(message.body),
            type: MessageType.SENT
          }})
        } catch(e) {/* Errors are handled via Redux reducers */}
        break
    }
  }
}