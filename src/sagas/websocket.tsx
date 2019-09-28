import { eventChannel } from 'redux-saga'
import { take, call, put } from 'redux-saga/effects'
import { WEBSOCKET_CONNECTED, WEBSOCKET_UNAUTHORIZED, WEBSOCKET_ERROR, WEBSOCKET_MESSAGE, LOGIN_SUCCESS } from '../common/constants'
import socketIO from 'socket.io-client'

let socket

const initWebsocket = (session: string) =>
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
      reconnection: true,
      reconnectionAttempts: Infinity,
      jsonp: false
    })

    socket.on('connect', () => {
      socket.emit('register')
      return emitter({type: WEBSOCKET_CONNECTED})
    })

    socket.on('error', error =>
      emitter({type: error.match(/not authorized/) ? WEBSOCKET_UNAUTHORIZED : WEBSOCKET_ERROR, error})
    )

    socket.on('connect_error', error =>
      emitter({type: WEBSOCKET_ERROR, error})
    )

    socket.on('conv', ({m, o}: {m: string, o: string}) => {
      if (m === 'push')
        return emitter({type: WEBSOCKET_MESSAGE, payload: JSON.parse(o)})
    })

    return () => {
      console.log('Socket off')
    }
  })

export default function* websocketSagas() {
  const { payload: { session } } = yield take(LOGIN_SUCCESS)
  console.log('-----', session)
  const channel = yield call(initWebsocket, session)
  while (true) {
    const action = yield take(channel)
    yield put(action)
  }
}