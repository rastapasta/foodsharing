import React from 'react'
import { Text, View, StyleSheet } from 'react-native'

import colors from '../utils/colors'

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 5
  },
  text: {
    color: colors.version,
    fontSize: 10
  }
})

export default () => (
  <View style={styles.container}>
    <Text style={styles.text}>Version 0.0.1-ProofOfConcept</Text>
  </View>
)