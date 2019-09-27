import { createAction } from 'redux-actions'
import createOneShotMiddleware from 'redux-middleware-oneshot'
import { AppState } from 'react-native'
import { APPSTATE } from '../common/constants'

export const TYPE = APPSTATE
export const action = createAction(TYPE)

export const middleware = createOneShotMiddleware((dispatch) => {
  const handle = state => state && dispatch(action(state.toLowerCase()))

  handle(AppState.currentState)
  AppState.addEventListener('change', handle)
})