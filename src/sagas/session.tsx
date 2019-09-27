import { take, fork, cancel, call, put, cancelled, select } from 'redux-saga/effects'
import { Actions } from 'react-native-router-flux'

import { LOGOUT, LOGIN_ACTION, LOGIN_SUCCESS, LOGIN_ERROR } from '../constants'

import { login } from '../utils/api'

function* logout () {
  // dispatches the CLIENT_UNSET action
  // yield put(unsetClient())

  // remove our token
  // localStorage.removeItem('token')

  Actions.reset('login')
}

function* loginFlow (email, password) {
  let user
  try {
    user = yield call(login, email, password)

    // inform Redux to set our client user, this is non blocking so...
    // yield put(setClient(user))

    yield put({ type: LOGIN_SUCCESS })

    // set a stringified version of our user to localstorage on our domain
    // localStorage.setItem('user', JSON.stringify(user))

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

function* loginWatcher () {
  while (true) {
    console.log('login watcher startet')
    yield take(LOGIN_ACTION)
    const { email, password } = yield select(state => state.login)

    const task = yield fork(loginFlow, email, password)
    const action = yield take([LOGOUT, LOGIN_ERROR])

    if (action.type === LOGOUT) yield cancel(task)
    yield call(logout)
  }
}

export default loginWatcher