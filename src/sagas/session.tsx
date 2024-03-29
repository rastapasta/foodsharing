import { take, fork, call, put, select } from 'redux-saga/effects'
import { Actions } from 'react-native-router-flux'
import * as Keychain from 'react-native-keychain'
import { actions as formActions } from 'react-redux-form'
import CookieManager from 'react-native-cookies'
import SplashScreen from 'react-native-splash-screen'

import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGOUT,
  KEYCHAIN,
  PROFILE,
  BELLS_REQUEST
} from '../common/constants'

import { login, logout, getCurrentUser, getSession, getCurrentProfile, setSession, syncCookies } from '../api'
import { Results } from '../common/typings'
import { Linking } from 'react-native'

function* loginFlow(email: string, password: string) {
  try {
    // Make sure and clean all cookies known to us
    yield CookieManager.clearAll()

    // Here we go, login the user
    const { id } = yield call(login, email, password)

    // All good, let's proceed to main
    Actions.reset('drawer')

    // .. or to another scene if we got a deep link incoming
    const initial = yield getInitialScene()
    if (initial)
      Actions.jump(initial.scene, initial.props)

    // Save the validated email and password in the device's safe store
    yield Keychain.setGenericPassword(email, password)

    // If we came that far, unhide the splash screen
    yield SplashScreen.hide()

    // Signal our succesful login and broadcast our fresh token and session
    yield put({type: LOGIN_SUCCESS, payload: {...getSession(), id}})

    // Pull our bells
    yield put({type: BELLS_REQUEST})

    // Request and broadcast the profile information of our fresh user
    yield put({type: PROFILE, payload: yield call(getCurrentProfile)})

  } catch (error) {
    // Signal that something went wrong..
    yield put({ type: LOGIN_ERROR, error })
  }
}

function* logoutFlow() {
  // Reset all forms
  yield put(formActions.reset('drafts'))
  yield put(formActions.change('login.password', ''))

  // Throw the user back to the login screen
  Actions.reset('login')

  // Delete the previously stored password from the secure location
  yield Keychain.resetGenericPassword()

  // Try to logout the user out from foodsharing.network
  try {
    yield call(logout)
  } catch(e) {
    console.log('online logout failed', e)
  }

  // Hard reset all system cookies
  yield CookieManager.clearAll()
}

function* getInitialScene() {
  try {
    const url = yield Linking.getInitialURL()
    if (url.match(/share\?/))
      return {
        scene: 'offerBasket',
        props: {
          picture: {uri: 'file://' + url.split(/share\?/)[1]}
        }
      }
    if (url.match(/essenskoerbe\//))
      return {
        scene: 'basket',
        props: {
          id: parseInt(url.split(/essenskoerbe\//)[1])
        }
      }
  } catch(e) {}
  return null
}


function* reauthenticateFlow() {
  const { session, token } = yield select(state => state.app)
  try {
    // No session, no fun.
    if (!session)
      throw 'no stored session'

    // Let's always assume we got a working session - predictive ux for the win!
    const initial = yield getInitialScene()
    setTimeout(() => {
      Actions.reset('drawer')
      if (initial)
        Actions.jump(initial.scene, initial.props)

      SplashScreen.hide()
    }, 100)

    // Configure our API adapter to use the stored session & token
    setSession({session, token})

    // Check if we still have a valid session at hand
    const { id } = yield getCurrentUser()

    // Yep, let's save and sync our cookies between production and beta
    yield syncCookies()

    // Notificate all listeners that we got a valid session running
    yield put({type: LOGIN_SUCCESS, payload: {session, token, id}})

    // Pull our bells
    yield put({type: BELLS_REQUEST})

    // Refresh and broadcast the profile information of our
    yield put({type: PROFILE, payload: yield call(getCurrentProfile)})

  } catch(error) {
    // In case the login failed because the user is offline..
    if (error === Results.CONNECTION_ERROR) {
      // .. continue from cache and assume we got a valid session
      yield put({type: LOGIN_SUCCESS, payload: {session, token}})
    } else {
      // .. or report why we failed
      console.log('reauthentication failed', error)

      // Try to pull previously stored credentials from secure store
      const result = yield Keychain.getGenericPassword()

      // If we don't find what we need, directly proceed to login
      if (!result || !result.username || !result.password)
        return Actions.reset('login')

      // Blast them through the pipe to get 'em into the store
      const { username: email, password } = result
      yield put({type: KEYCHAIN, payload: {email, password}})

      // Populate our login state/form
      yield put(formActions.change('login.email', email))
      yield put(formActions.change('login.password', password))

      // ... to finally trigger the login procedure
      yield put({type: LOGIN_REQUEST})
    }
  }

  // Wait for our reauthentication either fail or succeed
  const { type } = yield take([LOGIN_SUCCESS, LOGIN_ERROR])
  if (type === LOGIN_ERROR) {
    yield SplashScreen.hide()
    yield Actions.reset('login')
  }
}

export default function* loginSaga() {
  // Wait until our store got rehydrated
  yield take('persist/REHYDRATE')

  // Water our store with previously stored session and credentials
  yield fork(reauthenticateFlow)

  while (true) {
    // Wait until we get a login request
    const { type } = yield take([LOGIN_REQUEST, LOGIN_SUCCESS])

    // Skip authentication in case we got a rehydrated LOGIN_SUCCESS
    if (type === LOGIN_REQUEST) {

      // Pull the login form from
      const { email, password } = yield select(state => state.login)

      // Start the login flow
      yield fork(loginFlow, email, password)
    }

    // Wait until we either logout or get logged out
    const { type: logoutReason } = yield take([LOGOUT, LOGIN_ERROR])

    // Start the logout flow if the user desires to do so
    if (logoutReason === LOGOUT)
      yield call(logoutFlow)
  }
}