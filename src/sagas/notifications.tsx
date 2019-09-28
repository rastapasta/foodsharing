import { take } from 'redux-saga/effects'

import PushNotificationIOS from "@react-native-community/push-notification-ios";

import { APPSTATE, WEBSOCKET_MESSAGE } from '../common/constants'

export default function* notificationWatcher() {
  while (true) {

    // Wait until the app switches into background mode
    while (true) {
      const { payload } = yield take(APPSTATE)
      if (payload === 'background' || payload === 'inactive')
        break
    }

    // Wait until the app either receives a message or wakes up
    while (true) {
      const { type, payload } = yield take([APPSTATE, WEBSOCKET_MESSAGE])

      // Woke up? Start over!
      if (type === APPSTATE && payload === 'active')
        break

      // Message received in background -> notify user
      if (type === WEBSOCKET_MESSAGE) {
        const { body, sender } = payload

        PushNotificationIOS.presentLocalNotification({
          alertTitle: sender,
          alertBody: body
        })
      }
    }
  }
}

