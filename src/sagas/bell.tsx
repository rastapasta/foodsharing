import { take, put, call, fork, select } from 'redux-saga/effects'

import { getBells, markBell, deleteBell } from '../api'

import {
  // BELL_DELETE_REQUEST,
  // BELL_DELETE_SUCCESS,
  // BELL_READ_REQUEST,
  // BELL_READ_SUCCESS,
  BELLS_REQUEST,
  BELLS_SUCCESS
} from '../common/constants'

import { MessageType } from '../common/typings'
import { Actions } from 'react-native-router-flux'

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
  while (true) {
    // Wait until we get a conversation request
    yield take(BELLS_REQUEST)
    yield fork(fetchBells)
  }
}