import { take, put, select } from 'redux-saga/effects'

import {
  BACKGROUND_STATE,
  CONVERSATIONS_REQUEST,
  BELLS_REQUEST,
  CONVERSATION_REQUEST,
  BASKETS_NEARBY_REQUEST,
  BASKETS_REQUEST
} from '../common/constants'

export default function* refresherSaga() {
  while (true) {
    // Wait until we get an app background state change
    const { payload: inBackground } = yield take(BACKGROUND_STATE)

    // Start over if we go into the background
    if (inBackground)
      continue

    // -> Here we are, freshly back out of the background, let's refresh!

    yield put({type: CONVERSATIONS_REQUEST})
    yield put({type: BELLS_REQUEST})

    const { scene, sceneId } = yield select(state => state.app)

    switch (scene) {
      case 'conversation':
        yield put({type: CONVERSATION_REQUEST, payload: {id: sceneId, offset: 0}})
        break

      case 'baskets':
        yield put({type: BASKETS_NEARBY_REQUEST})
        yield put({type: BASKETS_REQUEST})
        break
    }
  }
}