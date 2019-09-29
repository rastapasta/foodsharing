import PushNotificationIOS from '@react-native-community/push-notification-ios'
import { Platform } from 'react-native'
import { take } from 'redux-saga/effects'
import { APPSTATE, WEBSOCKET_MESSAGE } from '../common/constants'

export default function* notificationSaga() {
  // Only activate background notifications on iOS for now
  if (Platform.OS !== 'ios')
    return

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
        const { body, fs_name } = payload

        PushNotificationIOS.presentLocalNotification({
          alertTitle: fs_name,
          alertBody: body
        })
      }
    }
  }
}

