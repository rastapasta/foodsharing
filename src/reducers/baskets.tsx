import {
  BASKET_ADD_REQUEST,
  BASKET_ADD_SUCCESS,
  BASKET_UPLOAD_REQUEST,
  BASKET_UPLOAD_SUCCESS,
  BASKETS_SUCCESS,
  BASKETS_REQUEST,
  BASKET_SUCCESS,
  REQUEST_ERROR,
  BASKET_UPDATE_REQUEST,
  BASKET_UPDATE_SUCCESS,
  LOGOUT,
  BASKET_DELETE_REQUEST,
  BASKET_DELETE_SUCCESS,
  BASKETS_NEARBY_SUCCESS,
} from '../common/constants'
import { mergeWithState, stateWithoutId } from '../common/utils'
import { BasketListing } from '../common/typings'

const initialState = {
  posting: false,
  uploading: false,
  loading: false,
  deleting: false,

  baskets: {},
  own: [],
  nearby: []
}

export default function reducer(state = initialState, action: any = {}) {
  const { type, payload } = action
  switch (type) {
    case BASKET_DELETE_REQUEST:
      return {
        ...state,
        deleting: true
      }

    case BASKET_DELETE_SUCCESS:
      return {
        ...state,
        deleting: false,
        baskets: stateWithoutId(state.baskets, payload),
        own: state.own.filter(own => own !== payload)
      }

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

    case BASKETS_NEARBY_SUCCESS:
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
        ...(type === BASKETS_NEARBY_SUCCESS ?
          {nearby: payload.map((basket: BasketListing) => basket.id)} :
          {own: payload.map((basket: BasketListing) => basket.id)}
        )
      }

    case BASKET_UPDATE_REQUEST:
    case BASKET_ADD_REQUEST:
      return {
        ...state,
        posting: true
      }

    case BASKET_UPDATE_SUCCESS:
    case BASKET_ADD_SUCCESS:
      return {
        ...state,
        own: type === BASKET_ADD_SUCCESS ? [...state.own, payload.id] : state.own,
        baskets: mergeWithState(state.baskets, payload.id, {
          ...payload,
          creator: payload.creator.id
        }),
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

    case REQUEST_ERROR:
      return {
        ...state,
        posting: false,
        uploading: false,
        loading: false,
        deleting: false
      }

    case LOGOUT:
      return {...initialState}

    default:
      return state
  }
}
