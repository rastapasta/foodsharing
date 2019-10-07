import AsyncStorage from '@react-native-community/async-storage'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import createSagaMiddleware from 'redux-saga'

import { persistStore, persistReducer } from 'redux-persist'

import reducers from '../reducers'
import sagas from '../sagas'

import backgroundState from '../middlewares/BackgroundState'
import networkState from '../middlewares/NetworkState'

declare var window: { __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any }

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: [
    'app',
    'messages',
    'conversations',
    'drafts',
    'foodsavers',
    'profile',
    'markers',
    'fairteiler',
    'walls',
    'baskets'
  ]
}

const persistedReducer = persistReducer(persistConfig, reducers)
    , sagaMiddleware = createSagaMiddleware()
    , composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    , middleware = [backgroundState, networkState, thunk, sagaMiddleware]
    , enhancer = composeEnhancers(applyMiddleware(...middleware))

export const store = createStore(persistedReducer, enhancer)
export const persistor = persistStore(store)

sagaMiddleware.run(sagas)
