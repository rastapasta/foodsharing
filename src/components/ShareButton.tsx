import React from 'react'
import {TouchableOpacity, Share} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import colors from '../common/colors'

type Props = {
  title: string
  url: string
}

export default ({title, url}: Props) =>
  <TouchableOpacity
    onPress={() =>
      Share.share({
        dialogTitle: title,
        message: url
      } as any)
    }
  >
    <Icon
      name="share-variant"
      color={colors.white}
      size={25}
      style={{marginRight: 11, marginTop: 1}}
    />
  </TouchableOpacity>
