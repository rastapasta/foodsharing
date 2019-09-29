import { take, call, race, put, delay } from 'redux-saga/effects'
import { Platform } from 'react-native'
import { eventChannel } from 'redux-saga'
import BackgroundFetch from 'react-native-background-fetch'

import {
  LOGIN_SUCCESS,
  LOGOUT,
  BACKGROUND,
  BACKGROUND_DONE,
  BACKGROUND_ERROR,
  CONVERSATIONS_REQUEST
} from '../common/constants'

const configuration = {
  minimumFetchInterval: 15,
  stopOnTerminate: false,
  startOnBoot: true
}

// Build an event channel around the background task notifier
function start() {
  return eventChannel(emitter => {
    BackgroundFetch.configure(configuration,
      () => emitter({type: BACKGROUND}),
      (error) => emitter({type: BACKGROUND_ERROR, error})
    )

    return () => BackgroundFetch.stop()
  })
}

function finish() {
  BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA)
}

export default function* backgroundSagas() {
  // Only active on iOS for now
  if (Platform.OS !== 'ios')
    return

  while (true) {
    // Wait for a first successful login
    yield take(LOGIN_SUCCESS)

    // Start the BackgroundFetch task as an event channel
    const channel = yield call(start)

    while(true) {
      // Wait for either a logout or background event
      const { logout, background } = yield race({
        logout: take(LOGOUT),
        background: take(channel)
      })

      // In case we got logged out, disable the background fetch
      if (logout) {
        channel.close()
        break
      }

      // From here on we *are* the background task!

      // ... let's announce it!
      yield put(background)

      // const conversations = yield select(state => state.conversations)
      // Initiate a conversations list refresh
      yield put({type: CONVERSATIONS_REQUEST})

      // Make sure to keep its request time much below the 30s max that would kill our process
      const { error } = yield race({
        success: take(BACKGROUND_DONE),
        error: delay(10000)
      })

      // Report and error in case our task didn't finish in time
      if (error)
        yield put({type: BACKGROUND_ERROR, error: 'background task timeout got triggered'})

      yield call(finish)
    }
  }
}