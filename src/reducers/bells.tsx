import {
  BELLS_SUCCESS,
  BELL_DELETE_SUCCESS,
  BELL_READ,
  BELL_DELETE_REQUEST,
  LOGOUT
} from '../common/constants'

import { Bell } from '../common/typings'

const initialState = []

export default function reducer(state: Bell[] = initialState, action: any = {}): Bell[] {
  const { type, payload } = action
  switch (type) {
    // Process a sucessful bells request
    case BELLS_SUCCESS:
      return payload.map(bell => ({
        ...bell,
        isRead: false
      }))

    // Remove a succesfull deleted bell
    case BELL_READ:
      return state.map(bell => ({
        ...bell,
        ...(bell.id === payload ? {isRead: true} : {})
      }))

    // Remove a succesfull deleted bell
    case BELL_DELETE_REQUEST:
      return state.map(bell => ({
        ...bell,
        ...(bell.id === payload ? {deleting: true} : {})
      }))

    // Remove a succesfull deleted bell
    case BELL_DELETE_SUCCESS:
      return state.filter(bell => bell.id !== payload)

    // Destroy our bells from store in case the user logs out
    case LOGOUT:
      return [...initialState]

    default:
      return state
  }
}
