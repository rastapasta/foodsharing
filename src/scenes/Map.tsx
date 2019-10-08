import React, { PureComponent } from 'react'
import { StyleSheet, View } from 'react-native'
import colors from '../common/colors'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as reduxActions from '../common/actions'

import { Actions } from 'react-native-router-flux'

import MapButton from '../components/MapButton'
import MapCluster from '../components/MapCluster'

import ClusteredMapView from 'react-native-maps-super-cluster'
import MapMarker from '../components/MapMarker'
import config from '../common/config'

const defaultZoom = {
        longitudeDelta: 1.1,
        latitudeDelta: 1.1
      }

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    flex: 1
  },
  gps: {
    bottom: 10,
    right: 10,
  },
  zoomOut: {
    bottom: 10,
    right: 50
  }
})

type Props = {
  actions: any,
  markers: any,
  profile: any,
  isFocused: boolean
}

class Map extends PureComponent<Props> {
  refs: {
    map: ClusteredMapView
  }

  state = {
    trackPosition: false,
    fairteiler: []
  }

  componentDidMount() {
    const { actions } = this.props
    actions.navigation('map')
    actions.fetchMarkers()
  }

  componentDidUpdate(prevProps: Props) {
    const { actions } = this.props
    if (prevProps.isFocused === false && this.props.isFocused === true)
      actions.navigation('map')
  }

  transformMarkers() {
    const { markers } = this.props
    return ['fairteiler', 'baskets'].reduce((all, type) =>
      all.concat(
        markers[type].map(marker => ({
          type,
          id: marker.id,
          location: {
            latitude: parseFloat(marker.lat),
            longitude: parseFloat(marker.lon)
          }
        }))
      ), []
    )
  }

  render() {
    const { trackPosition } = this.state
        , { profile } = this.props
        , data = this.transformMarkers()
        , INIT_REGION = profile.lat && profile.lon ?
          {
            longitude: parseFloat(profile.lon),
            latitude: parseFloat(profile.lat),
            ...defaultZoom
          } : config.initialMapRegion

    return (
      <View style={styles.container} testID="map.scene">
        <ClusteredMapView
          ref="map"
          data={data}
          style={styles.map}

          initialRegion={INIT_REGION}

          radius={40}

          edgePadding={{left: 40, top: 40, right: 40, bottom: 40}}

          showsUserLocation={trackPosition}
          followsUserLocation
          animateClusters={false}

          renderMarker={marker =>
            <MapMarker
              key={'marker.'+marker.type+'.'+marker.id}
              marker={marker}
              onPress={() =>
                marker.type === 'fairteiler' ?
                Actions.fairteiler({id: marker.id}) :
                Actions.basket({id: marker.id})
              }
            />
          }

          renderCluster={(cluster, onPress) =>
            <MapCluster
              key={'cluster.'+cluster.id}
              cluster={cluster}
              onPress={onPress}
            />
          }
        />
        <MapButton
          onPress={() => this.setState({trackPosition: !trackPosition})}
          style={styles.gps}
          icon="crosshairs-gps"
          color={colors[trackPosition ? 'green' : 'black']}
          testID="map.position"
        />
        <MapButton
          onPress={() => this.refs.map.mapview.animateToRegion(config.initialMapRegion)}
          style={styles.zoomOut}
          icon="arrow-decision-outline"
          testID="map.zoomout"
        />
      </View>
    )
  }
}

const mapStateToProps = state => ({
  markers: state.markers,
  profile: state.profile
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(reduxActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Map)
