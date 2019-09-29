import React from 'react'
import { Marker } from 'react-native-maps'

const icons = {
        fairteiler: require('../../assets/marker/marker_fairteiler.png')
      }

export default ({marker, onPress}) =>
  <Marker
    image={icons[marker.type]}
    coordinate={marker.location}
    anchor={{x: 0.5, y: 1}}
    onPress={onPress}
  />