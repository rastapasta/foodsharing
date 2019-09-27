import { combineReducers } from 'redux'
import { createForms } from 'react-redux-form'

import routes from './routes'
import app from './app'
import conversations from './conversations'
import messages from './messages'


export default combineReducers({
  routes,
  app,
  conversations,
  messages,

  ...createForms({
    login: __DEV__ ? {
      email: 'm.strassburger@gmail.com',
      password: 'testtest'
    } : {}
  })
})
