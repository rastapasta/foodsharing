import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'

import colors from '../common/colors'
import { translate } from '../common/translation'

const styles = StyleSheet.create({
  container: {
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 5,
    paddingLeft: 15
  },
  raised: {
    backgroundColor: colors.white,
    paddingRight: 15,
  },
  text: {
    fontFamily: 'SFMono-Regular',
    textTransform: 'uppercase',
    color: colors.white,
    fontSize: 14
  },
  raisedText: {
    color: colors.background,
  }
})

type Props = {
  label: string
  raised?: boolean
  onPress: () => void
}

export default (props: Props) =>
  <TouchableOpacity
    style={[styles.container, !!props.raised && styles.raised]}
    onPress={props.onPress}
  >
    <Text style={[styles.text, !!props.raised && styles.raisedText]}>
      {translate(props.label)}
    </Text>
  </TouchableOpacity>