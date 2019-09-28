import socketIO from 'socket.io-client'
import { eventChannel } from 'redux-saga'
import { take, call, put } from 'redux-saga/effects'

import {
  WEBSOCKET_CONNECTED,
  WEBSOCKET_DISCONNECT,
  WEBSOCKET_UNAUTHORIZED,
  WEBSOCKET_ERROR,
  WEBSOCKET_MESSAGE,
  LOGIN_SUCCESS,
  LOGOUT
} from '../common/constants'

function initWebsocket(session: string) {
  return eventChannel(emitter => {
    // Connect to the live's system's socket server - handles messages for beta as well
    const socket = socketIO('https://foodsharing.de', {
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

    // Here we go, got a connection
    socket.on('connect', () => {
      // .. register our client
      socket.emit('register')

      // .. and let everyone know
      emitter({type: WEBSOCKET_CONNECTED, payload: socket})
    })

    // Error handling on library level
    socket.on('error', error =>
      emitter({type: error.match(/not authorized/) ? WEBSOCKET_UNAUTHORIZED : WEBSOCKET_ERROR, error})
    )

    // Error handling on connection level
    socket.on('connect_error', error =>
      emitter({type: WEBSOCKET_ERROR, error})
    )

    // Handle incoming websocket messages
    socket.on('conv', ({m, o}: {m: string, o: string}) => {
      if (m === 'push')
        return emitter({type: WEBSOCKET_MESSAGE, payload: JSON.parse(o)})
    })

    // Notify redux any time the connection drops
    socket.on('disconnect', () =>
      emitter({type: WEBSOCKET_DISCONNECT})
    )

    // Tell the event channel reactor how to disconnect
    return () =>
      socket.close()

  })
}

export default function* websocketSagas() {
  while (true) {
    // Wait until we got a successful login
    const { payload: { session } } = yield take(LOGIN_SUCCESS)

    // Start up the websocket event channel
    const channel = yield call(initWebsocket, session)

    while (true) {
      // Wait for an action emitted by the websocket channel
      // TODO: implement take from channel OR LOGOUT
      const action = yield take(channel)
          , { type } = action

      // Close the channel/socket in case the user logged out
      if (type === LOGOUT) {
        channel.close()
        break
      }

      // Pass through the received actions
      yield put(action)
    }
  }
}