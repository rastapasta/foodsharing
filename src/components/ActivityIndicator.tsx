import React from 'react'
import { StyleSheet, View, ActivityIndicator } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
})

export default ({backgroundColor, color}) =>
  <View style={[styles.container, !!backgroundColor && {backgroundColor}]}>
    <ActivityIndicator
      animating
      color={color}
      size="large"
    />
  </View>