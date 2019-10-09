import React, { PureComponent } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import colors from '../common/colors'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 6,
    marginLeft: 8,
    marginRight: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 10,
    color: colors.profileButton
  },
  indicator: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

type Props = {
  icon: string,
  label: string,
  color: string,
  disabled: boolean,
  loading: boolean,
  onPress?: () => void
}

export default class ProfileButton extends PureComponent<Props> {
  render() {
    const { icon, label, color, onPress, disabled, loading } = this.props

    return (
      <TouchableOpacity
        style={styles.container}
        onPress={onPress}
        disabled={disabled || loading}
      >
        {loading ?
          <View style={styles.indicator}>
            <ActivityIndicator size="small" color={color} />
          </View> :
          <Icon name={icon} size={26} color={color}/>
        }
        <Text style={[styles.buttonText, {color}]}>{label}</Text>
      </TouchableOpacity>
    )
  }
}
