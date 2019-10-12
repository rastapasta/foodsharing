import * as React from 'react'
import { AppRegistry, YellowBox } from 'react-native'
import * as Sentry from '@sentry/react-native'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import Router from './scenes/Router'

import { store, persistor } from './common/store'

if (!__DEV__)
  Sentry.init({
    dsn: 'https://a2e6886eaca440cbac0c281f0d50834c@sentry.io/1777047',
  })

YellowBox.ignoreWarnings([
  'Warning: componentWillReceiveProps',
  'Warning: componentWillMount',
  'Calling bridge.imageLoader',
  'Warning: componentWillUpdate',
  'Setting DrawerLayoutAndroid'
])

export default class App extends React.Component {
  render() {
    return <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Router />
      </PersistGate>
    </Provider>
  }
}

AppRegistry.registerComponent('foodsharing', () => App)
