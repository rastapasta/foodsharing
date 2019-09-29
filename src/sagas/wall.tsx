import { take, put, fork } from 'redux-saga/effects'

import { getWall } from '../common/api'
import { WALL_REQUEST, WALL_SUCCESS } from '../common/constants'

function* fetch(target: 'foodsaver' | 'fairteiler', id: number) {
  yield put({
    type: WALL_SUCCESS,
    target,
    id,
    payload: yield getWall(target, id)
  })
}

export default function* conversationSaga() {
  while (true) {
    // Wait until we get a wall request
    const { payload: { target, id } } = yield take(WALL_REQUEST)
    yield fork(fetch, target, id)
  }
}