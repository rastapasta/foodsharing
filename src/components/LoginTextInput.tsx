import React, {PureComponent} from 'react'
import {View, StyleSheet, Dimensions} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Control } from 'react-redux-form/native'
import { translate } from '../common/translation'

import colors from '../common/colors'

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
  model: string
  icon?: string
  placeholder?: string
}

export default class LoginTextInput extends PureComponent<Props> {
  render() {
    const {obfuscate, placeholder, icon, model } = this.props

    return (
      <View style={styles.container}>
        <Control.TextInput
          model={model}
          keyboardType={obfuscate ? 'default' : 'email-address' }
          autoCorrect={false}
          style={styles.input}
          secureTextEntry={!!obfuscate}
          placeholder={translate(placeholder)}
          autoCapitalize="none"
          placeholderTextColor={colors.inputPlaceholder}
          testID={`login${model}`}
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
