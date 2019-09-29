import React from 'react'
import { StyleSheet, View, ActivityIndicator } from 'react-native'
import colors from '../common/colors'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white
  }
})

export default () =>
  <View style={styles.container}>
    <ActivityIndicator
      animating
      size="large"
    />
  </View>