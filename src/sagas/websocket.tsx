import { eventChannel } from 'redux-saga'
import { take, call, put } from 'redux-saga/effects'
import { WEBSOCKET_CONNECTED, WEBSOCKET_UNAUTHORIZED, WEBSOCKET_ERROR, MESSAGE_RECEIVED } from '../constants'
import socketIO from 'socket.io-client'

let socket

const initWebsocket = session =>
  eventChannel(emitter => {
    socket = socketIO('https://beta.foodsharing.de', {
      transportOptions: {
        polling: {
          extraHeaders: {
            Cookie: 'PHPSESSID=' + session
          }
        }
      },
      path: '/chat/socket.io/',
      reconnectionDelay: 5000,
      reconnection: false,
      reconnectionAttempts: Infinity,
      jsonp: false
    })

    socket.on('connect', () => {
      socket.emit('register')
      return emitter({type: WEBSOCKET_CONNECTED})
    })

    socket.on('error', (reason) =>
      emitter({type: reason.match(/not authorized/) ? WEBSOCKET_UNAUTHORIZED : WEBSOCKET_ERROR})
    )

    socket.on('connect_error', (reason) => console.error('connection_error: ' + reason))

    socket.on('conv', ({m, o}: {m: string, o: string}) => {
      if (m === 'push')
        return emitter({type: MESSAGE_RECEIVED, payload: JSON.parse(o)})
    })

    return () => {
      console.log('Socket off')
    }
  })

export default function* websocketSagas() {
  const channel = yield call(initWebsocket, '6hvsvhcjqgckradegtq4p26ojt')
  while (true) {
    const action = yield take(channel)
    yield put(action)
  }
}