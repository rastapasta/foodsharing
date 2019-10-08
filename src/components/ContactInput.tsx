import React, { PureComponent } from 'react'
import { StyleSheet, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { TextField } from 'react-native-material-textfield'

import colors from '../common/colors'

const styles = StyleSheet.create({
  icon: {
    position: 'absolute',
    bottom: 14,
    left: 10
  }
})

type Props = {
  onChange: (text) => void
  value: string
  icon: string
  testID: string
  placeholder: string
}

export default class ContactInput extends PureComponent<Props> {
  render() {
    const { value, onChange, icon, placeholder, testID } = this.props
    return (
      <View style={{paddingLeft: 10}}>
        <TextField
          value={value || ''}
          placeholder={placeholder}
          onChangeText={onChange}
          labelHeight={4}
          tintColor={colors.background}
          baseColor={colors.background}
          containerStyle={{marginTop: 10}}
          inputContainerStyle={{paddingLeft: 33}}
          fontSize={14}
          label=""
          keyboardType="number-pad"
          testID={testID}
        />

        <Icon
          name={icon}
          size={20}
          color={colors.background}
          style={styles.icon}
        />
      </View>
    )
  }
}
