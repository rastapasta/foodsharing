import React, { PureComponent } from 'react'
import { StyleSheet, TouchableOpacity, View, Text, Image } from 'react-native'
import colors from '../common/colors'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { getFairteilerMarker, getFairteiler } from '../common/api'

import ClusteredMapView from 'react-native-maps-super-cluster'
import { Marker } from 'react-native-maps'

const INIT_REGION = {
  longitude: 10.60117067,
  latitude: 50.34470266,
  longitudeDelta: 13.894483079,
  latitudeDelta: 12.61906546
}
const icons = {
  cluster: require('../../assets/marker/marker_cluster.png'),
  fairteiler: require('../../assets/marker/marker_fairteiler.png')
}

const clusterImageSize = 50

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  map: {
    flex: 1
  },
  touchableIcon: {
    position: 'absolute',
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
    elevation: 5
  },
  gps: {
    bottom: 10,
    right: 10,
  },
  zoomOut: {
    bottom: 10,
    right: 50
  },

  cluster: {
    aspectRatio: 1,
    width: clusterImageSize,
    height: clusterImageSize,
    alignItems: 'center',
    justifyContent: 'center'
  },
  clusterImage: {
    width: clusterImageSize,
    height: clusterImageSize,
    position: 'absolute'
  },
  clusterText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
    paddingLeft: 1
  }
})

type Props = {}

export default class Map extends PureComponent<Props> {
  refs: {
    map: ClusteredMapView
  }

  state = {
    trackPosition: false,
    fairteiler: []
  }

  async componentDidMount() {
    this.setState({fairteiler: await getFairteilerMarker()})
  }

  renderCluster = (cluster, onPress) => {
    const { pointCount, coordinate } = cluster

    return (
      <Marker coordinate={coordinate} onPress={onPress}>
        <View style={styles.cluster}>
          <Image source={icons.cluster} style={styles.clusterImage} />
          <Text style={styles.clusterText}>
            {pointCount}
          </Text>
        </View>
      </Marker>
    )
  }

  renderMarker = (data) =>
    <Marker
      key={data.id}
      image={icons[data.type]}
      coordinate={data.location}
      anchor={{x: 0.5, y: 1}}
      onPress={async () => console.log(await getFairteiler(data.id))}
    />

  render() {
    const { trackPosition, fairteiler } = this.state
        , data = fairteiler.map(teiler => ({
          type: 'fairteiler',
          id: teiler.id,
          location: {
            latitude: parseFloat(teiler.lat),
            longitude: parseFloat(teiler.lon)
          }
        }))

    const TouchableIcon = ({style, onPress, icon, color = 'black'}) =>
      <TouchableOpacity
        style={[styles.touchableIcon, style]}
        onPress={onPress}
        hitSlop={{left: 5, right: 5, top: 5, bottom: 5}}
      >
        <Icon
          name={icon}
          size={20}
          color={color}
        />
      </TouchableOpacity>

    return (
      <View style={styles.container}>
        <ClusteredMapView
          ref="map"
          data={data}
          showsUserLocation={trackPosition}
          followsUserLocation
          style={styles.map}
          renderMarker={this.renderMarker}
          renderCluster={this.renderCluster}
          initialRegion={INIT_REGION}
          radius={40}
          edgePadding={{left: 40, top: 40, right: 40, bottom: 40}}
        />
        <TouchableIcon
          onPress={() => this.setState({trackPosition: !trackPosition})}
          style={styles.gps}
          icon="crosshairs-gps"
          color={colors[trackPosition ? 'green' : 'black']}
        />
        <TouchableIcon
          onPress={() => this.refs.map.mapview.animateToRegion(INIT_REGION)}
          style={styles.zoomOut}
          icon="arrow-decision-outline"
        />
      </View>
    )
  }
}