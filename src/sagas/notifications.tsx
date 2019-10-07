import { take, select, put } from 'redux-saga/effects'

import PushNotification from 'react-native-push-notification'
import PushNotificationIOS from '@react-native-community/push-notification-ios'
import { Platform } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { store } from '../common/store'

import config from '../common/config'

import {
  BACKGROUND_STATE,
  WEBSOCKET_MESSAGE,
  CONVERSATIONS_SUCCESS,
  BACKGROUND_DONE,
  LOGIN_SUCCESS,
  NOTIFICATION_CLICKED
} from '../common/constants'

// Setup our nofitication flow
export default function* notificationSaga() {
  // Wait for a successful login
  yield take(LOGIN_SUCCESS)

  // Seupt the native Push Notification service
  yield PushNotification.configure({

    // Listen for interactions with a displayed notification
    onNotification: notification => {
      store.dispatch({type: NOTIFICATION_CLICKED})

      // If we were able to set some data along with the notification (iOS), handle it!
      const { data } = notification
      if (data && data.conversationId)
        Actions.conversation({conversationId: data.conversationId})
      else
        Actions.conversations()

      // If we're on iOS, trigger the expected callback
      if (Platform.OS === 'ios')
        notification.finish(PushNotificationIOS.FetchResult.NoData)
    }
  })

  while (true) {
    // Wait until the app switches into background mode when requested
    if (config.notificationsOnlyInBackground)
      while (true) {
        const { payload } = yield take(BACKGROUND_STATE)
        if (payload === true)
          break
      }

    // Wait until the app either receives a message or wakes up
    while (true) {
      const { type, payload } = yield take([BACKGROUND_STATE, WEBSOCKET_MESSAGE, CONVERSATIONS_SUCCESS])

      // Woke up and only enabled in background? Start over!
      if (type === BACKGROUND_STATE) {
        if (config.notificationsOnlyInBackground && payload === false)
          break
        continue
      }

      const inBackground = (yield select(state => state.app.background)) === true

      // Only send a notification if either in background or user configured foreground notifications
      if (!inBackground && config.notificationsOnlyInBackground)
        continue

      // Successful conversations pull after waking up
      // TODO: handle conversation diff for background push
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

        // Push a notification over the bridge
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

