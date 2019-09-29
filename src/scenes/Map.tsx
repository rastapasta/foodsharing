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

const INIT_REGION = {
  longitude: 10.60117067,
  latitude: 50.34470266,
  longitudeDelta: 13.894483079,
  latitudeDelta: 12.61906546
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
  markers: any
}

class Map extends PureComponent<Props> {
  refs: {
    map: ClusteredMapView
  }

  state = {
    trackPosition: false,
    fairteiler: []
  }

  async componentDidMount() {
    const { actions } = this.props
    actions.fetchMarkers()
  }

  transformMarkers() {
    const { markers } = this.props
    return markers.map(marker => ({
      type: 'fairteiler',
      id: marker.id,
      location: {
        latitude: parseFloat(marker.lat),
        longitude: parseFloat(marker.lon)
      }
    }))
  }

  render() {
    const { trackPosition } = this.state
        , { actions } = this.props
        , data = this.transformMarkers()

    return (
      <View style={styles.container}>
        <ClusteredMapView
          ref="map"
          data={data}
          style={styles.map}

          initialRegion={INIT_REGION}

          radius={40}

          edgePadding={{left: 40, top: 40, right: 40, bottom: 40}}

          showsUserLocation={trackPosition}
          followsUserLocation

          renderMarker={marker => <MapMarker key={'marker.'+marker.id} marker={marker} onPress={() => Actions.fairteiler({id: marker.id})} />}
          renderCluster={(cluster, onPress) => <MapCluster key={'cluster.'+cluster.id} cluster={cluster} onPress={onPress} />}
        />
        <MapButton
          onPress={() => this.setState({trackPosition: !trackPosition})}
          style={styles.gps}
          icon="crosshairs-gps"
          color={colors[trackPosition ? 'green' : 'black']}
        />
        <MapButton
          onPress={() => this.refs.map.mapview.animateToRegion(INIT_REGION)}
          style={styles.zoomOut}
          icon="arrow-decision-outline"
        />
      </View>
    )
  }
}

const mapStateToProps = state => ({
  markers: state.markers
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(reduxActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Map)
