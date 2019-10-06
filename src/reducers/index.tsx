import { combineReducers } from 'redux'
import { createForms } from 'react-redux-form'

import config from '../common/config'

import app from './app'
import conversations from './conversations'
import messages from './messages'
import foodsavers from './foodsavers'
import profile from './profile'
import markers from './markers'
import fairteiler from './fairteiler'
import walls from './walls'
import baskets from './baskets'

export default combineReducers({
  app,
  foodsavers,
  conversations,
  messages,
  profile,
  markers,
  fairteiler,
  walls,
  baskets,

  ...createForms({
    login: config.credentials || {},
    drafts: {}
  })
})
