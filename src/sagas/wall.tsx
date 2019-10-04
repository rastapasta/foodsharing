import { take, put, fork } from 'redux-saga/effects'

import { getWall } from '../api'
import { WALL_REQUEST, WALL_SUCCESS } from '../common/constants'

function* fetch(target: 'foodsaver' | 'fairteiler', id: number) {
  try {
    yield put({
      type: WALL_SUCCESS,
      target,
      id,
      payload: yield getWall(target, id)
    })
  } catch(e) {/* Errors are handled via Redux reducers */}
}

export default function* conversationSaga() {
  while (true) {
    // Wait until we get a wall request
    const { payload: { target, id } } = yield take(WALL_REQUEST)

    // .. and process it in the 'background'
    yield fork(fetch, target, id)
  }
}