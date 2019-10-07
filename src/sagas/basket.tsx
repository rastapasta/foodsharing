import { take, put, fork } from 'redux-saga/effects'

import {
  BASKET_ADD_REQUEST,
  BASKET_ADD_SUCCESS,
  BASKET_UPLOAD_REQUEST,
  BASKET_UPLOAD_SUCCESS,
  BASKETS_REQUEST,
  BASKETS_SUCCESS,
  BASKET_REQUEST,
  BASKET_SUCCESS,
  BASKETS_NEARBY_REQUEST,
  BASKET_UPDATE_REQUEST,
  BASKET_UPDATE_SUCCESS,
  BASKET_DELETE_REQUEST,
  BASKET_DELETE_SUCCESS,
  BASKETS_NEARBY_SUCCESS
} from '../common/constants'
import { addBasket, uploadBasket, getMyBaskets, getBasket, updateBasket, deleteBasket, getNearbyBaskets } from '../api/adapters/rest'
import { Actions } from 'react-native-router-flux'

function* basketWatcher() {
  while (true) {
    // Wait until we get a basket request
    const { payload: id } = yield take([BASKET_REQUEST])
    try {
      // Fetch and return it
      yield put({type: BASKET_SUCCESS, payload: yield getBasket(id)})
    } catch(e) {/* Errors are handled via Redux reducers */}
  }
}

function* nearbyBasketWatcher() {
  while (true) {
    // Wait until we get a nearby basket request
    yield take([BASKETS_NEARBY_REQUEST])
    try {
      // Fetch and return it
      yield put({type: BASKETS_NEARBY_SUCCESS, payload: yield getNearbyBaskets()})
  } catch(e) {/* Errors are handled via Redux reducers */}
  }
}

function* deleteBasketWatcher() {
  while (true) {
    // Wait until we get a delete request
    const { payload: id } = yield take([BASKET_DELETE_REQUEST])
    try {
      // Fetch and return it
      yield deleteBasket(id)
      yield put({type: BASKET_DELETE_SUCCESS, payload: id})

      // And leave the scene of action
      Actions.pop()
    } catch(e) {/* Errors are handled via Redux reducers */}
  }
}

function* updateBasketWatcher() {
  while (true) {
    // Wait until we get a update request
    const { payload } = yield take([BASKET_UPDATE_REQUEST])
    try {
      // Fetch and return it
      yield put({type: BASKET_UPDATE_SUCCESS, payload: yield updateBasket(payload)})

      // Leave the edit scene
      Actions.pop()
    } catch(e) {/* Errors are handled via Redux reducers */}
  }
}

function* myBasketsWatcher() {
  while (true) {
    // Wait until we get a basket add request
    yield take([BASKETS_REQUEST])
    try {
      // Fetch and return it
      yield put({type: BASKETS_SUCCESS, payload: yield getMyBaskets()})
    } catch(e) {/* Errors are handled via Redux reducers */}
  }
}

function* addBasketWatcher() {
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

function* uploadBasketWatcher() {
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
  yield fork(basketWatcher)
  yield fork(uploadBasketWatcher)
  yield fork(addBasketWatcher)
  yield fork(myBasketsWatcher)
  yield fork(updateBasketWatcher)
  yield fork(nearbyBasketWatcher)
  yield fork(deleteBasketWatcher)
}