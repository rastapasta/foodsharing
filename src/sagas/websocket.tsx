import socketIO from 'socket.io-client'
import { eventChannel } from 'redux-saga'
import { take, call, put, race } from 'redux-saga/effects'
import { AllHtmlEntities } from 'html-entities'

import {
  WEBSOCKET_CONNECTED,
  WEBSOCKET_DISCONNECT,
  WEBSOCKET_UNAUTHORIZED,
  WEBSOCKET_ERROR,
  WEBSOCKET_RECONNECT,
  WEBSOCKET_MESSAGE,
  LOGIN_SUCCESS,
  LOGOUT
} from '../common/constants'
import { Message, MessageType } from '../common/typings'
import config from '../common/config'

const entities = new AllHtmlEntities()

function initWebsocket(session: any) {
  return eventChannel(emitter => {
    // Connect to the live's system's socket server - handles messages for beta as well
    const socket = socketIO(config.websocketHost, {
      forceNew: true,
      path: '/chat/socket.io/',
      reconnectionDelay: 3000,
      reconnection: true,
      reconnectionAttempts: Infinity,
      jsonp: false
    })

    // Here we go, got a connection
    socket.on('connect', () => {
      // .. register our client
      socket.emit('register')

      // .. and let everyone know
      emitter({type: WEBSOCKET_CONNECTED})
    })

    // Error handling on library level
    socket.on('error', error =>
      emitter({type: (typeof error === 'string' && error.match(/not authorized/)) ? WEBSOCKET_UNAUTHORIZED : WEBSOCKET_ERROR})
    )

    // Error handling on connection level
    socket.on('connect_error', error =>
      emitter({type: WEBSOCKET_ERROR, error})
    )

    // Handle incoming websocket message
    socket.on('conv', ({m, o}: {m: string, o: string}) => {
      if (m === 'push') {
        const payload = JSON.parse(o) as Message

        payload.body = entities.decode(payload.body)
        payload.type = payload.fs_id === session.id ? MessageType.SENT : MessageType.RECEIVED

        return emitter({type: WEBSOCKET_MESSAGE, payload})
      }
    })

    // Notify redux any time the connection drops
    socket.on('disconnect', () =>
      emitter({type: WEBSOCKET_DISCONNECT})
    )

    // Notify redux any time the connection drops
    socket.on('reconnect', () =>
      emitter({type: WEBSOCKET_RECONNECT})
    )

    // Tell the event channel reactor how to disconnect
    return () => {
      socket.disconnect()
    }
  })
}

export default function* websocketSaga() {
  while (true) {
    // Wait until we got a successful login
    const { payload: session }  = yield take(LOGIN_SUCCESS)

    // Start up the websocket event channel
    const channel = yield call(initWebsocket, session)

    while (true) {
      // Wait for a logout or an action emitted by the websocket channel
      const { message, logout } = yield race({
        message: take(channel),
        logout: take(LOGOUT)
      })

      // Close the channel/socket in case the user logged out
      if (logout) {
        channel.close()
        break
      }

      // Pass through the received actions
      yield put(message)
    }
  }
}