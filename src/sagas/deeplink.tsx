import { Linking } from 'react-native'
import { eventChannel } from 'redux-saga'
import { take, put, call } from 'redux-saga/effects'

import { DEEPLINK } from '../common/constants'
import { Actions } from 'react-native-router-flux'

export default function* deeplinkSaga() {
  const linking = yield call(initLinkingWatcher)

  while (true) {
    const action = yield take(linking)
        , url = action.payload

    yield put(action)

    if (url.startsWith('share?'))
      Actions.push('offerBasket', {picture: {uri: url.split(/share\?/)[1]}})

    if (url.startsWith('essenskoerbe'))
      Actions.push('basket', {id: parseInt(url.split(/essenskoerbe\//)[1])})
  }
}

function initLinkingWatcher() {
  return eventChannel(emitter => {
    const handler = ({url}) => emitter({type: DEEPLINK, payload: (url || '').split(/foodsharing\.de\//).pop()})

    Linking.addListener('url', handler)

    return () =>
      Linking.removeEventListener('url', handler as any)
  })
}
