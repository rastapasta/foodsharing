import { take, put, fork } from 'redux-saga/effects'

import {
  BASKET_ADD_REQUEST,
  BASKET_ADD_SUCCESS,
  BASKET_IMAGE_REQUEST
  // BASKET_PICTURE_SUCCESS,
} from '../common/constants'
import { addBasket } from '../api/adapters/rest'
import { Actions } from 'react-native-router-flux'

function* addWatcher() {
  while (true) {
    // Wait until we get a basket add request
    const { payload } = yield take([BASKET_ADD_REQUEST])

    try {
      // Publish a fresh basket!
      const basket = yield addBasket(payload)
      yield put({type: BASKET_ADD_SUCCESS, payload: basket})

      // If the basket got created with an image, trigger its upload after creation
      if (payload.picture)
        yield put({type: BASKET_IMAGE_REQUEST, payload: {id: basket.id, picture: basket.picture}})
      else
        Actions.replace('basket', {id: basket.id})

    } catch(e) {/* Errors are handled via Redux reducers */}
  }
}

export default function* basketSaga() {
  yield fork(addWatcher)
}