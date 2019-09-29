import { take, put } from 'redux-saga/effects'

import { getFairteiler } from '../common/api'

import { FAIRTEILER_REQUEST, FAIRTEILER_SUCCESS } from '../common/constants'

export default function* fairteilerSaga() {
  while (true) {
    // Wait until we get a fairteiler request
    const { payload: id } = yield take(FAIRTEILER_REQUEST)

    // Pull the markers from the API
    const fairteiler = yield getFairteiler(id)

    // ... and publish them on the bus
    yield put({type: FAIRTEILER_SUCCESS, payload: fairteiler})
  }
}