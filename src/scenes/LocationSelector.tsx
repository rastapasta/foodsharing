import React, { PureComponent } from 'react'
import { StyleSheet, View } from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as reduxActions from '../common/actions'

import MapView, { Marker } from 'react-native-maps'
import MapButton from '../components/MapButton'
import colors from '../common/colors'

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center'
  },
  staticMarker: {
    width: 30,
    height: 35,
    transform: [
      {translateX: 2},
      {translateY: -13}
    ]
  },
  gps: {
    bottom: 10,
    right: 10,
  }
})

type Point = {
  longitude: number,
  latitude: number
}

type Props = {
  location: {
    longitude: number,
    latitude: number
  }
  callback: (Point) => void
  actions: any,
  isFocused: boolean
}

class LocationSelector extends PureComponent<Props> {
  refs: {
    map: MapView
  }

  state: {
    trackPosition: boolean,
    region: any
  }

  constructor(props: Props) {
    super(props)

    const { location } = props
    this.state = {
      region: location,
      trackPosition: false
    }
  }

  componentDidMount() {
    const { actions } = this.props
    actions.navigation('locationSelector')
  }

  componentDidUpdate(prevProps: Props) {
    const { actions } = this.props
    if (prevProps.isFocused === false && this.props.isFocused === true)
      actions.navigation('locationSelector')
  }

  render() {
    const { callback } = this.props
        , { region: { longitude, latitude }, trackPosition } = this.state

    return (
      <View style={styles.container} testID="locationSelector.scene">
        <MapView
          ref="map"
          style={styles.map}
          testID="locationSelector.map"
          onRegionChange={region => {
            this.setState({region})
            callback(region)
          }}

          initialRegion={{
            longitude,
            latitude,
            latitudeDelta: 0.008,
            longitudeDelta: 0.008
          }}

          showsPointsOfInterest={false}
          showsCompass={false}
          showsScale={false}
          showsMyLocationButton={false}
          showsTraffic={false}
          showsIndoors={false}
          pitchEnabled={false}
          rotateEnabled={false}

          showsUserLocation={trackPosition}
          followsUserLocation
        >
          <Marker pointerEvents="none" coordinate={{longitude, latitude}} />
        </MapView>

        <MapButton
          onPress={() => this.setState({trackPosition: !trackPosition})}
          style={styles.gps}
          icon="crosshairs-gps"
          color={colors[trackPosition ? 'green' : 'black']}
          testID="locationSelector.gps"
        />
      </View>
    )
  }
}

const mapStateToProps = () => ({})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(reduxActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LocationSelector)
