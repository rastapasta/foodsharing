import {
  BASKET_ADD_REQUEST,
  BASKET_ADD_SUCCESS,
  BASKET_IMAGE_REQUEST,
  BASKET_IMAGE_SUCCESS,
} from '../common/constants'

const initialState = {
  posting: false,
  uploading: false,
  loading: false,

  baskets: {},
  own: [],
  nearby: []
}

export default function reducer(state = initialState, action: any = {}) {
  switch (action.type) {
    case BASKET_ADD_REQUEST:
      return {
        ...state,
        posting: true
      }

    case BASKET_ADD_SUCCESS:
      return {
        ...state,
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
