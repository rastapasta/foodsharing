import React, { PureComponent } from 'react'
import { StyleSheet, TouchableOpacity, View, Text, Image } from 'react-native'
import colors from '../common/colors'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { getFairteiler } from '../common/api'

import ClusteredMapView from 'react-native-maps-super-cluster'
import { Marker } from 'react-native-maps'

const INIT_REGION = {
  latitude: 41.8962667,
  longitude: 11.3340056,
  latitudeDelta: 12,
  longitudeDelta: 12
}

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
    map: ClusteredMapView
  }

  state = {
    trackPosition: false,
    fairteiler: [{lon: "33", lat: "12"}]
  }

  async componentDidMount() {
    this.setState({fairteiler: await getFairteiler()})
  }

  renderCluster = (cluster, onPress) => {
    const { pointCount, coordinate, clusterId } = cluster
        , size = 50

    return (
      <Marker coordinate={coordinate} onPress={onPress}>
        <View style={{aspectRatio: 1, width: 50, height: 50, alignItems: 'center', justifyContent: 'center'}}>
          <Image source={require('../../assets/marker/marker_cluster.png')} style={{width: 50, height: 50, position: 'absolute'}} />
          <Text style={{color: 'white', fontSize: 10}}>
            {pointCount}
          </Text>
        </View>
      </Marker>
    )
  }

  renderMarker = (data) =>
    <Marker key={data.id || Math.random()} coordinate={data.location} />

  render() {
    const { trackPosition, fairteiler } = this.state
        , data = fairteiler.map(teiler => ({location: {latitude: parseFloat(teiler.lat), longitude: parseFloat(teiler.lon)}}))
    console.log(data)
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
          edgePadding={{left: 20, top: 20, right: 20, bottom: 20}}
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
      </View>
    )
  }
}
