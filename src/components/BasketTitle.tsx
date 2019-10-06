import React from 'react'
import { Text, StyleSheet, Platform, View } from 'react-native'

import colors from '../common/colors'
import { translate } from '../common/translation'

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center'
  },
  title: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 17,
    textAlign: Platform.OS === 'ios' ? 'center' : 'left'
  }
})

export default ({id}) =>
  <View style={styles.container}>
    <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>
      {translate('scenes.basket', {id})}
    </Text>
  </View>
