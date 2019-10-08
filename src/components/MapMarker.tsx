import React from 'react'
import { Marker } from 'react-native-maps'
import { store } from '../common/store'
import { FAIRTEILER_PREFETCH } from '../common/constants'

const icons = {
        fairteiler: require('../../assets/marker/marker_fairteiler.png'),
        baskets: require('../../assets/marker/marker_basket.png')
      }
    , seen = {}

type Props = {
  marker: {
    id?: number
    type: string,
    location: {
      latitude: number,
      longitude: number,
    }
  }
  onPress?: () => void
}

export default ({marker, onPress}: Props) => {
  // TODO: this logic so def. doesn't belong here O:)
  if (marker.type === 'fairteiler' && !seen[marker.id]) {
    store.dispatch({type: FAIRTEILER_PREFETCH, payload: marker.id})
    seen[marker.id] = true
  }

  return <Marker
    testID={`marker.${marker.type}.${marker.id}`}
    image={icons[marker.type]}
    coordinate={marker.location}
    anchor={{x: 0.5, y: 1}}
    onPress={onPress}
    centerOffset={{x: 1, y: -12}}
  />
}