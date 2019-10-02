import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'

import colors from '../common/colors'
import { translate } from '../common/translation'

const circleSize = 50
    , valueSize = 16

const styles = StyleSheet.create({
  container: {
    width: circleSize,
    height: circleSize,
    borderRadius: circleSize / 2,
    overflow: 'hidden'
  },
  circle: {
    flex: 1,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.badge,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5
  },
  value: {
    color: colors.white,
    fontSize: valueSize
  },
  label: {
    color: colors.white,
    marginTop: -2,
    fontSize: 9
  }
})

export default ({label, value, unit, onPress}) =>
  <TouchableOpacity
    style={styles.container}
    onPress={onPress}
    disabled={!onPress}
  >
    <View style={styles.circle}>
      <Text
        style={styles.value}
        numberOfLines={1}
        adjustsFontSizeToFit={true}
      >
        {
          unit === 'kg' && value > 1000 ? Math.round(value/100)/10 : value
        }{
          unit === 'kg' && value > 1000 ? 't' : unit
        }
      </Text>
      <Text
        style={styles.label}
        numberOfLines={1}
        adjustsFontSizeToFit={true}
      >
        {translate('profile.'+label)}
      </Text>
    </View>
  </TouchableOpacity>
