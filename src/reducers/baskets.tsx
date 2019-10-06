import {
  BASKET_ADD_REQUEST,
  BASKET_ADD_SUCCESS,
  BASKET_UPLOAD_REQUEST,
  BASKET_UPLOAD_SUCCESS,
  BASKETS_SUCCESS,
  BASKETS_REQUEST,
  BASKET_SUCCESS,
} from '../common/constants'
import { mergeWithState } from '../common/utils'
import { BasketListing } from '../common/typings'

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
    case BASKET_SUCCESS:
      return {
        ...state,
        baskets: mergeWithState(state.baskets, payload.id, {
          ...payload,
          creator: payload.creator.id
        })
      }

    case BASKETS_REQUEST:
      return {
        ...state,
        loading: true
      }

    case BASKETS_SUCCESS:
      return {
        ...state,
        loading: false,
        baskets:
          (payload as BasketListing[])
          .reduce((all, basket) => {
            all[basket.id] = {...(all[basket.id] || {}), ...basket}
            return all
          }, {...state.baskets}),
        own: payload.map((basket: BasketListing) => basket.id),
      }

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

    case BASKET_UPLOAD_REQUEST:
      return {
        ...state,
        uploading: true
      }

    case BASKET_UPLOAD_SUCCESS:
      return {
        ...state,
        uploading: false
      }

    default:
      return state
  }
}
