import { take, put, fork } from 'redux-saga/effects'

import {
  BASKET_ADD_REQUEST,
  BASKET_ADD_SUCCESS,
  BASKET_UPLOAD_REQUEST,
  BASKET_UPLOAD_SUCCESS
} from '../common/constants'
import { addBasket, uploadBasket } from '../api/adapters/rest'
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
      // Upload disabled for now until API struggle solved (always returning 400 because of 'empty body')
      // if (payload.picture)
      //   yield put({type: BASKET_UPLOAD_REQUEST, payload: {id: basket.id, picture: payload.picture.uri}})
      // else
      Actions.replace('basket', {id: basket.id})

    } catch(e) {/* Errors are handled via Redux reducers */}
  }
}

function* uploadWatcher() {
  while (true) {
    // Wait until we get a basket image upload request
    const { payload: {id, picture} } = yield take([BASKET_UPLOAD_REQUEST])
    try {
      const uploaded = yield uploadBasket(id, picture)
      yield put({type: BASKET_UPLOAD_SUCCESS, payload: uploaded})

    } catch(e) {/* Errors are handled via Redux reducers */}
  }
}

export default function* basketSaga() {
  yield fork(addWatcher)
  yield fork(uploadWatcher)
}