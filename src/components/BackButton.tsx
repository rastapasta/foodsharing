import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Actions } from 'react-native-router-flux'

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 20,
    justifyContent: 'center'
  }
})

export default () =>
  <TouchableOpacity
    onPress={() => Actions.pop()}
    hitSlop={{left: 5, right: 10, bottom: 10, top: 10}}
    style={styles.container}
  >
    <Icon name="chevron-left" size={36} color="#000" />
  </TouchableOpacity>