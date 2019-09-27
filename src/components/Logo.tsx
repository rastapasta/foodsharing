import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

import colors from '../common/colors'

const styles = StyleSheet.create({
  logo: {
    fontFamily: 'AlfaSlabOne-Regular'
  }
})

export default ({size}) =>
  <View>
    <Text style={[styles.logo, {fontSize: size}]}>
      <Text style={{color: colors.white}}>food</Text>
      <Text style={{color: colors.green}}>sharing</Text>
    </Text>
  </View>