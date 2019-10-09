import moment from 'moment'
import { translate } from "./translation"


export const stateWithoutId = (state, id) => {
  const newState = {...state}
      , key = `${id}`
  delete newState[key]
  return newState
}

export const mergeWithState = (state, id, options) => {
  const newState = {...state}
      , key = `${id}`

  newState[key] = {
    ...(state[key] || {}),
    ...options
  }

  return newState
}

export const formatDate = (str: any) => {
  const date = moment(str)
      , isToday = date.isSame(new Date(), 'day')
      , isYesterday = date.isSame(new Date(Date.now() - 24*60*60*1000), 'day')
      , thisYear = date.isSame(new Date(), 'year')

      return isToday ? translate('conversations.today') + ', ' + date.format('HH:mm') :
                isYesterday ? translate('conversations.yesterday') + ', ' + date.format('HH:mm') :
                thisYear ? date.format('LL').split(/,* \d{4}$/)[0] :
                date.format('LL')
}