import React, { PureComponent } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native'

import colors from '../common/colors'
import { translate } from '../common/translation'

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
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
  },
  incicator: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

type Props = {
  label: string
  raised?: boolean
  loading?: boolean
  onPress: () => void
}

export default class LoginButton extends PureComponent<Props> {
  render() {
    const { raised, onPress, label, loading } = this.props

    return (
      <TouchableOpacity
        style={[styles.container, !!raised && styles.raised]}
        hitSlop={{top: 10, left: 20, bottom: 20, right: 20}}
        onPress={onPress}
        testID={label}
      >
        <Text style={[styles.text, !!raised && styles.raisedText, !!loading && {opacity: 0}]}>
          {translate(label)}
        </Text>
        {loading &&
          <View style={styles.incicator}>
            <ActivityIndicator size="small" color={colors.background} />
          </View>
        }
      </TouchableOpacity>
    )
  }
}
