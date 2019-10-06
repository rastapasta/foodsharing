import {
  BASKET_ADD_REQUEST,
  BASKET_ADD_SUCCESS,
  BASKET_IMAGE_REQUEST,
  BASKET_IMAGE_SUCCESS,
} from '../common/constants'
import { mergeWithState } from '../common/utils'

const initialState = {
  posting: false,
  uploading: false,
  loading: false,

  baskets: {},
  own: [],
  nearby: []
}

export default function reducer(state = initialState, action: any = {}) {
  const { type, payload } = action
  switch (type) {
    case BASKET_ADD_REQUEST:
      return {
        ...state,
        posting: true
      }

    case BASKET_ADD_SUCCESS:
      return {
        ...state,
        baskets: mergeWithState(state.baskets, payload.id, payload),
        own: [...state.own, payload.id],
        posting: false
      }

    case BASKET_IMAGE_REQUEST:
      return {
        ...state,
        uploading: true
      }

    case BASKET_IMAGE_SUCCESS:
      return {
        ...state,
        uploading: false
      }

    default:
      return state
  }
}
