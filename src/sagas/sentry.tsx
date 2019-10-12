import { take } from 'redux-saga/effects'
import * as Sentry from '@sentry/react-native'
import {
  LOGIN_REQUEST,
  KEYCHAIN,
  MESSAGE_REQUEST,
  MESSAGE_SUCCESS,
  LOGIN_SUCCESS,
  PROFILE,
  CONVERSATION_SUCCESS,
  WEBSOCKET_MESSAGE,
  CONVERSATIONS_SUCCESS
} from '../common/constants'

const filter = {}

filter[LOGIN_REQUEST] = ['password']
filter[LOGIN_SUCCESS] = ['session', 'token']
filter[KEYCHAIN] = ['password']
filter[MESSAGE_REQUEST] = ['body']
filter[MESSAGE_SUCCESS] = ['body']
filter[WEBSOCKET_MESSAGE] = ['body']
filter[CONVERSATION_SUCCESS] = ['messages.*.body']
filter[CONVERSATIONS_SUCCESS] = ['*.last_message']
filter[PROFILE] = ['mobile', 'landline', 'lat', 'lon', 'address', 'lastname']

const recursiveReplacer = (path: string[], obj: any) => {
  if (path[0] === '*')
    obj.forEach(child => recursiveReplacer(path.slice(1), child))
  else if (path.length === 1 && obj && typeof obj[path[0]] === 'string')
    obj[path[0]] = obj[path[0]].replace(/./g, '*')
  else if (obj && obj[path[0]])
    recursiveReplacer(path.slice(1), obj[path[0]])
}

export default function* sentrSaga() {
  while (true) {
    // Wait until we get ANY event
    const { type, payload } = yield take()

    if (type.startsWith('rrf') || type.startsWith('@'))
      continue

    if (filter[type])
      filter[type].forEach(path =>
        recursiveReplacer(path.split(/\./), payload)
      )

    Sentry.addBreadcrumb({
      category: 'redux',
      message: type,
      level: type.match(/ERROR/) ? Sentry.Severity.Warning : Sentry.Severity.Info,
      ...(payload ?
        {data: typeof payload === 'object' ? payload : {payload}} :
        {}
      )
    })
  }
}