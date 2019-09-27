import { all } from 'redux-saga/effects'

import WebsocketSaga from './websocket'
import Session from './session'


export default function* rootSaga () {
  yield all([
    Session(),
    WebsocketSaga()
  ])
}