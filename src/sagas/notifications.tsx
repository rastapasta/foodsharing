import PushNotificationIOS from '@react-native-community/push-notification-ios'
import { Platform } from 'react-native'
import { take, select, put } from 'redux-saga/effects'
import {
  APPSTATE,
  WEBSOCKET_MESSAGE,
  CONVERSATIONS_SUCCESS,
  BACKGROUND_DONE
} from '../common/constants'

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
      const { type, payload } = yield take([APPSTATE, WEBSOCKET_MESSAGE, CONVERSATIONS_SUCCESS])

      // Woke up? Start over!
      if (type === APPSTATE && payload === 'active')
        break

      // Successful conversations pull after waking up
      if (type === CONVERSATIONS_SUCCESS) {
        // TODO: move that to background process
        console.log(type)

        const messages = yield select(state => state.messages)
        console.log(type, messages)
        // Check if any new message is still unread and not yet in our storage
        for (const conversation of payload) {
          if (conversation.unread !== '0' || messages[conversation.id][0].time !== conversation.last) {

            // We found an updated conversation - let the user know!
            yield PushNotificationIOS.presentLocalNotification({
              alertTitle: conversation.name || conversation.member.find(member => member.id === conversation.last_foodsaver_id).name,
              alertBody: conversation.last_message
            })
          }
        }

        yield put({type: BACKGROUND_DONE})
      }

      // Websocket Message received in background -> notify user
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

