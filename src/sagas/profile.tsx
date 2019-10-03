import { take, put, fork } from 'redux-saga/effects'

import { getProfile, requestFriendship } from '../api'
import {
  PROFILE_REQUEST,
  PROFILE_SUCCESS,
  FRIENDSHIP_REQUEST,
  FRIENDSHIP_SUCCESS
} from '../common/constants'

function* fetchProfile(id: number) {
  yield put({
    type: PROFILE_SUCCESS,
    payload: yield getProfile(id)
  })
}

function* fetchFriendship(userId: number) {
  yield requestFriendship(userId)
  yield put({
    type: FRIENDSHIP_SUCCESS,
    payload: userId
  })
}

export default function* profileSaga() {
  while (true) {
    // Wait until we get a profile or friendship request
    const { type, payload: id } = yield take([PROFILE_REQUEST, FRIENDSHIP_REQUEST])

    // ... and process it in the 'background'
    yield type === PROFILE_REQUEST ? fork(fetchProfile, id) :
          type === FRIENDSHIP_REQUEST ? fork(fetchFriendship, id) :
          null
  }
}