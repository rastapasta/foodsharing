import React, {PureComponent} from 'react'
import {View, StyleSheet, TextInput, Dimensions} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import colors from '../utils/colors'

const { width } = Dimensions.get('window')
    , height = 40
    , iconSize = height * .5

const styles = StyleSheet.create({
  container: {
    height: 40,
    width: width - 40,
    marginBottom: 10
  },
  input: {
    backgroundColor: colors.white,
    flex: 1,
    borderRadius: 5,
    paddingLeft: iconSize * 2,
    color: colors.inputText
  },
  icon: {
    position: 'absolute',
    left: iconSize * .5,
    top: height/2 - iconSize/2,
    color: colors.icon
  }
})

type Props = {
  obfuscate?: boolean
  icon?: string
  placeholder?: string
  onChange?: (string) => void
}

export default class LoginTextInput extends PureComponent<Props> {
  render() {
    const {obfuscate, placeholder, icon, onChange} = this.props

    return (
      <View style={styles.container}>
        <TextInput
          keyboardType={obfuscate ? 'default' : 'email-address' }
          autoCorrect={false}
          style={styles.input}
          secureTextEntry={!!obfuscate}
          placeholder={placeholder}
          autoCapitalize="none"
          placeholderTextColor={colors.inputPlaceholder}
          onChangeText={onChange}
        />
        {icon &&
          <Icon
            name={icon}
            size={iconSize}
            style={styles.icon}
          />
        }
      </View>
    )
  }
}
