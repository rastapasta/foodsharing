import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Actions } from 'react-native-router-flux'
import { isIphoneX } from 'react-native-iphone-x-helper'

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: isIphoneX() ? 36 : 20,
    justifyContent: 'center',
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

export default () =>
  <TouchableOpacity
    testID="navigation.back"
    onPress={() => Actions.pop()}
    hitSlop={{left: 5, right: 40, bottom: 10, top: 40}}
    style={styles.container}
  >
    <Icon name="chevron-left" size={36} color="#fff" />
  </TouchableOpacity>