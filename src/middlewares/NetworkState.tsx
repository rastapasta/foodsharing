import createOneShotMiddleware from 'redux-middleware-oneshot'
import NetInfo from '@react-native-community/netinfo'
import { CONNECTION_STATUS } from '../common/constants'

let last

export default createOneShotMiddleware((dispatch) => {
  NetInfo.addEventListener(state => {
    const { isInternetReachable: online } = state

    if (last === online)
      return
    last = online

    if (online !== null)
      dispatch({type: CONNECTION_STATUS, payload: online})
  })
})