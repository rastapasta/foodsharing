import React from 'react'
import { StyleSheet, Image, Text, View } from 'react-native'
import { Marker } from 'react-native-maps'

import colors from '../common/colors'

const clusterImageSize = 50
    , image = require('../../assets/marker/marker_cluster.png')

const styles = StyleSheet.create({
  container: {
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
    fontSize: 11,
    fontWeight: 'bold',
    textAlignVertical: 'center',
    width: 17,
    textAlign: 'center'
  }
})

export default  ({cluster, onPress}) =>
  <Marker
    coordinate={cluster.coordinate}
    onPress={onPress}
  >
    <View style={styles.container}>
      <Image
        source={image}
        style={styles.clusterImage}
      />

      <Text
        style={styles.clusterText}
        adjustsFontSizeToFit
        numberOfLines={1}
      >
        {cluster.pointCount}
      </Text>
    </View>
  </Marker>
