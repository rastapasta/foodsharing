import { take, put } from 'redux-saga/effects'

import { REPORT_REQUEST, REPORT_SUCCESS } from '../common/constants'
import { report } from '../api'

export default function* reportSaga() {
  while (true) {
    // Wait until we get a report request
    const { payload: {userId, reasonId, reason, message} } = yield take(REPORT_REQUEST)

    try {
      // .. and handle it accordingly
      yield report(userId, reasonId, reason, message)
      yield put({
        type: REPORT_SUCCESS,
        payload: userId
      })

    } catch(e) {/* Errors are handled via Redux reducers */}
  }
}