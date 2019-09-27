import React, { PureComponent } from 'react'
import { View, StyleSheet } from 'react-native'
import colors from '../common/colors'
import MapView from 'react-native-maps'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  map: {
    flex: 1
  }
})

type Props = {}

export default class Map extends PureComponent<Props> {
  render() {
    return (
      <View style={styles.container}>
        <MapView style={styles.map} />
      </View>
    )
  }
}
