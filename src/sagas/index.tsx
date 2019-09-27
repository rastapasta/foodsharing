import { all } from 'redux-saga/effects'

import WebsocketSaga from './websocket'
import Session from './session'
import Conversations from './conversations'


export default function* rootSaga () {
  yield all([
    Session(),
    WebsocketSaga(),
    Conversations()
  ])
}