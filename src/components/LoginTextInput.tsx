import React, { PureComponent } from 'react'
import { StyleSheet, TextInput, Dimensions } from 'react-native'

import colors from '../colors'

const { width } = Dimensions.get('window')

const styles = StyleSheet.create({
  field: {
    backgroundColor: colors.white,
    height: 40,
    width: width - 40,
    borderRadius: 5
  }
})


type Props = {
  obfuscate?: boolean
  icon?: string
}

export default class LoginTextInput extends PureComponent<Props> {
  render() {
    const { obfuscate } = this.props

    return (
      <TextInput
        style={styles.field}
        secureTextEntry={!!obfuscate}
      />
    )
  }
}
