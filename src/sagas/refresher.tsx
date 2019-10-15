import { take, put, select, call } from 'redux-saga/effects'

import {
  BACKGROUND_STATE,
  DEEPLINK
} from '../common/constants'

export default function* refresherSaga() {
  while (true) {
    // Wait until we get an app background state change
    const { payload: inBackground } = yield take(BACKGROUND_STATE)

    // Start over if we go into the background
    if (inBackground)
      continue

    // -> Here we are, freshly back out of the background

    // Check if the current opener URL changed (detect image share to app)
    // yield checkDeeplink()

  }
}

// function* checkDeeplink() {
//   // Get current state's deeplink
//   const deeplink = yield select(state => state.app.deeplink)

//   // .. and try to get the app's current one
//   let currentDeeplink = null
//   try {
//     currentDeeplink = yield Linking.getInitialURL()
//   } catch(e) {}

//   // .. to update it if it differs
//   if (deeplink !== currentDeeplink)
//     yield put({type: DEEPLINK, payload: currentDeeplink})
// }