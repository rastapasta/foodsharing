import { createAction } from 'redux-actions'
import createOneShotMiddleware from 'redux-middleware-oneshot'
import NetInfo from '@react-native-community/netinfo'
import { CONNECTION_STATUS } from '../common/constants'

export const TYPE = CONNECTION_STATUS
export const action = createAction(TYPE)

let last = null

export const middleware = createOneShotMiddleware((dispatch) => {
  NetInfo.addEventListener(state => {
    const { isInternetReachable } = state

    if (last === isInternetReachable)
      return
    last = isInternetReachable

    if (isInternetReachable !== null)
      dispatch(action(isInternetReachable))
  })
})