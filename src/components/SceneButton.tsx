import React from 'react'
import {TouchableOpacity, Platform} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import colors from '../common/colors'

type Props = {
  icon: string
  onPress: () => void
}

export default ({icon, onPress}: Props) =>
  <TouchableOpacity
    onPress={onPress}
    testID={`navigation.${icon}`}
  >
    <Icon
      name={icon}
      color={colors.white}
      size={25}
      style={{marginRight: Platform.OS === 'android' ? 20 : 11, marginTop: 1}}
    />
  </TouchableOpacity>
