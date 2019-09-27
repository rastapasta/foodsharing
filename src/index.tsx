import * as React from 'react'
import { AppRegistry } from 'react-native'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import Router from './scenes/Router'
import configureStore from './store'

const { store, persistor } = configureStore()

export default class Foodsharing extends React.Component {
  render() {
    return <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Router />
      </PersistGate>
    </Provider>
  }
}

AppRegistry.registerComponent('foodsharing', () => Foodsharing)
