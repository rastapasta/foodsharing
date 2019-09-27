import React from 'react'
import { Text, Linking, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'

import colors from '../common/colors'
import { translate } from '../common/translation'

const {width} = Dimensions.get('window')
    , URL = 'https://foodsharing.de/?page=login&sub=passwordReset'

const styles = StyleSheet.create({
  container: {
    width: width - 40,
    alignItems: 'flex-end'
  },
  text: {
    color: colors.green,
    textDecorationLine: 'underline'
  }
})

export default () => (
  <TouchableOpacity
    style={styles.container}
    onPress={() => Linking.openURL(URL)}
  >
    <Text style={styles.text}>
      {translate('login.forgot')}
    </Text>
  </TouchableOpacity>
)