import { all } from 'redux-saga/effects'

import WebsocketSaga from './websocket'
import Session from './session'
import Conversations from './conversations'
import Conversation from './conversation'
import Notifications from './notifications'
import Markers from './markers'
import Fairteiler from './fairteiler'
import Wall from './wall'
import Background from './background'
import Profile from './profile'

// Start all our sagas in parallel
export default function* rootSaga () {
  yield all([
    Session(),
    WebsocketSaga(),
    Conversations(),
    Conversation(),
    Notifications(),
    Markers(),
    Fairteiler(),
    Wall(),
    Background(),
    Profile()
  ])
}