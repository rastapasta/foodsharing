import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

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
    backgroundColor: '#64AE24'
  },
  value: {
    color: colors.white,
    fontSize: valueSize
  },
  label: {
    color: colors.white,
    fontSize: 8
  }
})

export default ({label, value, unit}) =>
  <View style={styles.container}>
    <View style={styles.circle}>
      <Text
        style={styles.value}
        numberOfLines={1}
        adjustsFontSizeToFit={true}
      >
        {value}{unit}
      </Text>
      <Text
        style={styles.label}
        numberOfLines={1}
        adjustsFontSizeToFit={true}
      >
        {translate('profile.'+label)}
      </Text>
    </View>
  </View>
