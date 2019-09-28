import { take, fork, call, put, select } from 'redux-saga/effects'
import { Actions } from 'react-native-router-flux'
import * as Keychain from 'react-native-keychain'

import { LOGOUT, LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_ERROR, KEYCHAIN, PROFILE } from '../common/constants'

import { login, getSession, getProfile } from '../common/api'

function* logout() {
  // Throw the user back to the login screen
  Actions.reset('login')
}

function* loginFlow(email: string, password: string) {
  let user

  try {
    // Here we go, login the user
    user = yield call(login, email, password)

    // Signal our succesful login and broadcast our fresh token and session
    yield put({type: LOGIN_SUCCESS, payload: getSession()})

    // Save the validated email and password in the device's safe store
    Keychain.setGenericPassword(email, password).then(() => true)

    // All good, let's proceed to main
    Actions.reset('drawer')

    // Request and broadcast the profile information of our fresh user
    yield put({type: PROFILE, payload: yield call(getProfile)})
  } catch (error) {
    // Signal that something went wrong..
    yield put({ type: LOGIN_ERROR, error })
  }

  return user
}

function* loadCredentials() {
  // Try to pull previously stored credentials from secure store
  const result = yield Keychain.getGenericPassword()
  if (result) {
    const { username: email, password } = result

    // Blast them through the pipe to get 'em into the store
    yield put({type: KEYCHAIN, payload: {email, password}})
  }
}

export default function* loginWatcher() {
  // Water our store with previously stored credentials
  yield call(loadCredentials)

  while (true) {
    // Wait until we get a login request
    yield take(LOGIN_REQUEST)

    // Pull credentials from store
    const { email, password } = yield select(state => state.login)

    // Start the login flow
    yield fork(loginFlow, email, password)

    // Wait until we either logout or get logged out
    yield take([LOGOUT, LOGIN_ERROR])

    // Start the logout flow
    yield call(logout)
  }
}