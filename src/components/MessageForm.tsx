import React, { PureComponent } from 'react'
import { StyleSheet, View, TouchableOpacity} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { Control } from 'react-redux-form/native'

import colors from '../common/colors'
import { translate } from '../common/translation'

const styles = StyleSheet.create({
  container: {
    minHeight: 50,
    maxHeight: 100,
    paddingLeft: 15,
    paddingRight: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },

  button: {
    padding: 5,
    borderRadius: 12,
    backgroundColor: colors.messageSendButton,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft : 10
  },

  icon: {
    marginLeft: 5,
    transform: [{rotateZ: '-30deg'}]
  }
})

type Props = {
  onSend: (message) => Promise<boolean>
  model: string
  active: boolean
}

export default class MessageForm extends PureComponent<Props> {
  state = {
    value: ''
  }

  sendMessage = async () => {
    const { value } = this.state
        , { onSend } = this.props

    if (await onSend(value))
      this.setState({value: ''})
  }

  render() {
    const { model, active } = this.props

    return (
      <View style={styles.container}>
        <Control.TextInput
          model={model}
          style={{flex: 1}}
          placeholder={translate('conversations.write_message')}
          placeholderTextColor={colors.messagePlaceholder}
          multiline
        />
        <TouchableOpacity
          hitSlop={{top: 10, right: 10, left: 10, bottom: 10}}
          style={[styles.button, !!active && {backgroundColor: colors.messageSendButtonActive}]}
          onPress={this.sendMessage}
          disabled={!active}
        >
          <Icon
            name="send"
            color={active ? colors.messageSendIconActive : colors.messageSendIcon}
            size={20}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    )
  }
}
