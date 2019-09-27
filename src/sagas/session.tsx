import { take, fork, call, put, cancelled, select } from 'redux-saga/effects'
import { Actions } from 'react-native-router-flux'
import * as Keychain from 'react-native-keychain'

import { LOGOUT, LOGIN_ACTION, LOGIN_SUCCESS, LOGIN_ERROR, KEYCHAIN } from '../constants'

import { login } from '../utils/api'

function* logout() {
  // dispatches the CLIENT_UNSET action
  // yield put(unsetClient())

  // remove our token
  // localStorage.removeItem('token')

  Actions.reset('login')
}

function* loginFlow(email, password) {
  let user
  try {
    user = yield call(login, email, password)

    // inform Redux to set our client user, this is non blocking so...
    // yield put(setClient(user))
    yield put({type: LOGIN_SUCCESS})

    Keychain.setGenericPassword(email, password).then(() => true)

    Actions.replace('main')

  } catch (error) {
    yield put({ type: LOGIN_ERROR, error })
  } finally {
    if (yield cancelled())
      Actions.replace('login')
  }

  // return the user for health and wealth
  return user
}

function* loadCredentials() {
  const result = yield Keychain.getGenericPassword()
  if (result) {
    const { username: email, password } = result
    yield put({type: KEYCHAIN, payload: {email, password}})
  }
}

function* loginWatcher() {
  yield call(loadCredentials)
  while (true) {
    yield take(LOGIN_ACTION)

    const { email, password } = yield select(state => state.login)

    yield fork(loginFlow, email, password)
    yield take([LOGOUT, LOGIN_ERROR])

    yield call(logout)
  }
}

export default loginWatcher