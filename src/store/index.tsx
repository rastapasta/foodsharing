import { AsyncStorage } from 'react-native'
import {createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { persistStore, persistReducer } from 'redux-persist'

import reducers from '../reducers'

import {middleware as appState} from '../middlewares/AppState'

declare var window: { __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any }

// WHITELIST
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['conversations']
}

const persistedReducer = persistReducer(persistConfig, reducers)

export default function configureStore() {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
      , middleware = [appState, thunk]
      , enhancer = composeEnhancers(
        applyMiddleware(...middleware)
      )
      , store = createStore(persistedReducer, enhancer)
      , persistor = persistStore(store)

  return {store, persistor}
}
