import React from 'react'
import {TouchableOpacity} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import colors from '../common/colors'

type Props = {
  icon: string
  onPress: () => void
}

export default ({icon, onPress}: Props) =>
  <TouchableOpacity
    onPress={onPress}
  >
    <Icon
      name={icon}
      color={colors.white}
      size={25}
      style={{marginRight: 11, marginTop: 1}}
    />
  </TouchableOpacity>
