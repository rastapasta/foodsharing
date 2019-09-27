import React, { PureComponent } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import colors from '../common/colors'
import MapView from 'react-native-maps'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  map: {
    flex: 1
  },
  gps: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: colors.white,
    padding: 6,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,

    elevation: 5,
  }
})

type Props = {}

export default class Map extends PureComponent<Props> {
  refs: {
    map: MapView
  }
  state = {
    trackPosition: false
  }

  render() {
    const { trackPosition } = this.state
    return (
      <TouchableOpacity style={styles.container}>
        <MapView
          ref="map"
          showsUserLocation={trackPosition}
          followsUserLocation
          style={styles.map}
        />

        <TouchableOpacity
          style={styles.gps}
          onPress={() => this.setState({trackPosition: !trackPosition})}
        >
          <Icon
            name="crosshairs-gps"
            size={20}
            color={colors[trackPosition ? 'green' : 'black']}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    )
  }
}
