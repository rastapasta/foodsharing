import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import colors from '../common/colors'

const styles = StyleSheet.create({
  container: {
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
  }
})

export default  ({style, onPress, icon, color = 'black', testID}) =>
  <TouchableOpacity
    style={[styles.container, style]}
    onPress={onPress}
    hitSlop={{left: 5, right: 5, top: 5, bottom: 5}}
    testID={testID}
  >
    <Icon
      name={icon}
      size={20}
      color={color}
    />
  </TouchableOpacity>
