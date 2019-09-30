import createOneShotMiddleware from 'redux-middleware-oneshot'
import { AppState } from 'react-native'
import { BACKGROUND_STATE } from '../common/constants'

let last

export default createOneShotMiddleware((dispatch) => {
  AppState.addEventListener('change', state => {
    const isBackground = state === 'inactive' || state === 'background' ? true : false

    if (last === isBackground)
      return
    last = isBackground

    dispatch({type: BACKGROUND_STATE, payload: isBackground})
  })
})