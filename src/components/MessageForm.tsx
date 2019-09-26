import React, { PureComponent } from 'react'
import { StyleSheet, View, TextInput, TouchableOpacity} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import colors from '../colors'
import { translate } from '../translation'

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
    const { value } = this.state

    return (
      <View style={styles.container}>
        <TextInput
          style={{flex: 1}}
          placeholder={translate('conversations.write_message')}
          placeholderTextColor={colors.messagePlaceholder}
          onChangeText={(value) => this.setState({value})}
          value={value}
          multiline
        />
        <TouchableOpacity
          hitSlop={{top: 10, right: 10, left: 10, bottom: 10}}
          style={[styles.button, !!value && {backgroundColor: colors.messageSendButtonActive}]}
          onPress={this.sendMessage}
          disabled={!value}
        >
          <Icon
            name="send"
            color={value ? colors.messageSendIconActive : colors.messageSendIcon}
            size={20}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    )
  }
}
