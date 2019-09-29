import { all } from 'redux-saga/effects'

import WebsocketSaga from './websocket'
import Session from './session'
import Conversations from './conversations'
import Conversation from './conversation'
import Notifications from './notifications'
import Markers from './markers'

// Start all our sagas in parallel
export default function* rootSaga () {
  yield all([
    Session(),
    WebsocketSaga(),
    Conversations(),
    Conversation(),
    Notifications(),
    Markers()
  ])
}