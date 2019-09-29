import React from 'react'
import { Marker } from 'react-native-maps'
import { store } from '../common/store'
import { FAIRTEILER_PREFETCH } from '../common/constants'

const icons = {
        fairteiler: require('../../assets/marker/marker_fairteiler.png')
      }
    , seen = {}

export default ({marker, onPress}) => {
  if (!seen[marker.id]) {
    store.dispatch({type: FAIRTEILER_PREFETCH, payload: marker.id})
    seen[marker.id] = true
  }

  return <Marker
    image={icons[marker.type]}
    coordinate={marker.location}
    anchor={{x: 0.5, y: 1}}
    onPress={onPress}
  />
}