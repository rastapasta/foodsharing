import { take, put, fork } from 'redux-saga/effects'

import { getBells, markBell, deleteBell } from '../api'

import {
  BELLS_REQUEST,
  BELLS_SUCCESS,
  BELL_READ,
  BELL_DELETE_REQUEST,
  BELL_DELETE_SUCCESS,
  WEBSOCKET_BELLS
} from '../common/constants'

// Wait for bell read actions and mark bells as read
function* markBellWatcher() {
  while (true) {
    const { payload: id } = yield take(BELL_READ)
    try {
      yield markBell(id)
    } catch(e) {/* Errors are handled via Redux reducers */}
  }
}

// Wait for bell delete action
function* deleteBellWatcher() {
  while (true) {
    const { payload: id } = yield take(BELL_DELETE_REQUEST)
    try {
      yield deleteBell(id)
      yield put({type: BELL_DELETE_SUCCESS, payload: id})
    } catch(e) {/* Errors are handled via Redux reducers */}
  }
}

function* fetchBells() {
  try {
    // Pull the current bells from the API and publish it on the bus
    yield put({
      type: BELLS_SUCCESS,
      payload: yield getBells()
    })
  } catch(e) {/* Errors are handled via Redux reducers */}
}


export default function* bellSaga() {
  yield fork(markBellWatcher)
  yield fork(deleteBellWatcher)

  while (true) {
    // Wait until we get a conversation request
    yield take([BELLS_REQUEST, WEBSOCKET_BELLS])
    yield fork(fetchBells)
  }
}