import moment from 'moment'
import { translate } from "./translation"

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

      return isToday ? translate('conversations.today') + ', ' + date.format('HH:ii') :
                isYesterday ? translate('conversations.yesterday') + ', ' + date.format('HH:ii') :
                thisYear ? date.format('MMMM Do') :
                date.format('MMMM Do YYYY')
}