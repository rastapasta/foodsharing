import { take, put } from 'redux-saga/effects'

import { getFairteilerMarker } from '../api'

import { MARKERS_REQUEST, MARKERS_SUCCESS } from '../common/constants'

export default function* markersSaga() {
  while (true) {
    // Wait until we get a markers request
    yield take(MARKERS_REQUEST)

    try {
      // Pull the markers from the API
      const markers = yield getFairteilerMarker()

      // ... and publish them on the bus
      yield put({type: MARKERS_SUCCESS, payload: markers})

    } catch(e) {/* Errors are handled via Redux reducers */}
  }
}