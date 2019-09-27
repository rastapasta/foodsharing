import { all } from 'redux-saga/effects'

import WebsocketSaga from './websocket'
import Session from './session'
import Conversations from './conversations'
import Conversation from './conversation'

export default function* rootSaga () {
  yield all([
    Session(),
    WebsocketSaga(),
    Conversations(),
    Conversation()
  ])
}