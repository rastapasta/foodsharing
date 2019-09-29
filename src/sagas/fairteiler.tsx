import { take, put, fork, select } from 'redux-saga/effects'

import { getFairteiler } from '../common/api'

import { FAIRTEILER_PREFETCH, FAIRTEILER_REQUEST, FAIRTEILER_SUCCESS } from '../common/constants'

function* fetch(id: number) {
  // Pull the markers from the API
  const fairteiler = yield getFairteiler(id)

  // ... and publish them on the bus
  yield put({type: FAIRTEILER_SUCCESS, payload: fairteiler})
}

export default function* fairteilerSaga() {
  while (true) {
    // Wait until we get a fairteiler request
    const { type, payload: id } = yield take([FAIRTEILER_REQUEST, FAIRTEILER_PREFETCH])

    // Only request if its a usual request or if the fairtailer isn't prefetched yet
    if (type === FAIRTEILER_REQUEST || !(yield select(state => state.fairteiler[`${id}`])))
      yield fork(fetch, id)
  }
}