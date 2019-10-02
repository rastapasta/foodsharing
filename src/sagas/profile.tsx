import { take, put, fork } from 'redux-saga/effects'

import { getProfile } from '../common/api'
import { PROFILE_REQUEST, PROFILE_SUCCESS } from '../common/constants'

function* fetch(id: number) {
  yield put({
    type: PROFILE_SUCCESS,
    payload: yield getProfile(id)
  })
}

export default function* profileSaga() {
  while (true) {
    // Wait until we get a profile request
    const { payload: id } = yield take(PROFILE_REQUEST)
    yield fork(fetch, id)
  }
}