import { combineReducers } from 'redux'

import routes from './routes'
import permissions from './permissions'

export default combineReducers({
  routes,
  permissions,
})
