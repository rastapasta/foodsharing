import PushNotification from 'react-native-push-notification'
import PushNotificationIOS from '@react-native-community/push-notification-ios'
import { Platform } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { store } from '../common/store'

const config = {
  NOTIFICATIONS_ONLY_IN_BACKGROUND: false
}

import { take, select, put } from 'redux-saga/effects'
import {
  APPSTATE,
  WEBSOCKET_MESSAGE,
  CONVERSATIONS_SUCCESS,
  BACKGROUND_DONE,
  LOGIN_SUCCESS,
  NOTIFICATION_CLICKED
} from '../common/constants'

export default function* notificationSaga() {
  yield take(LOGIN_SUCCESS)

  yield PushNotification.configure({
    onNotification: notification => {
      store.dispatch({type: NOTIFICATION_CLICKED})
      console.log(notification)

      const { conversationId } = notification.data
      if (conversationId)
        Actions.conversation({conversationId})
      else
        Actions.conversations()

      if (Platform.OS === 'ios')
        notification.finish(PushNotificationIOS.FetchResult.NoData)
    }
  })

  while (true) {
    // Wait until the app switches into background mode when requested
    if (config.NOTIFICATIONS_ONLY_IN_BACKGROUND)
      while (true) {
        const { payload } = yield take(APPSTATE)
        if (payload === 'background' || payload === 'inactive')
          break
      }

    // Wait until the app either receives a message or wakes up
    while (true) {
      const { type, payload } = yield take([APPSTATE, WEBSOCKET_MESSAGE, CONVERSATIONS_SUCCESS])

      // Woke up and only enabled in background? Start over!
      if (type === APPSTATE) {
        if (config.NOTIFICATIONS_ONLY_IN_BACKGROUND && payload === 'active')
          break
        continue
      }

      const inBackground = yield select(state => state.app.state !== 'active')

      // Only send a notification if either in background or user configured foreground notifications
      if (!inBackground && config.NOTIFICATIONS_ONLY_IN_BACKGROUND)
        continue

      // Successful conversations pull after waking up
      if (type === CONVERSATIONS_SUCCESS) {
        // const messages = yield select(state => state.messages)
        // console.log(type, messages)
        // Check if any new message is still unread and not yet in our storage
        // for (const conversation of payload) {
        //   if (conversation.unread !== '0' || messages[conversation.id][0].time !== conversation.last) {

        //     // We found an updated conversation - let the user know!
        //     yield PushNotificationIOS.presentLocalNotification({
        //       alertTitle: conversation.name || conversation.member.find(member => member.id === conversation.last_foodsaver_id).name,
        //       alertBody: conversation.last_message
        //     })
        //   }
        // }
        if (inBackground)
          yield put({type: BACKGROUND_DONE})
      }

      // Websocket Message received in background -> notify user
      if (type === WEBSOCKET_MESSAGE) {
        const { body, fs_name, cid: conversationId } = payload

        // When in foreground, only notificate if user isn't watching the conversation
        if (!inBackground) {
          const { scene, sceneId } = yield select(state => state.app)
          if (scene !== 'conversation' || sceneId !== conversationId)
            continue
        }

        PushNotification.localNotification({
          title: fs_name,
          message: body,
          userInfo: {
            conversationId
          }
        })
      }
    }
  }
}

