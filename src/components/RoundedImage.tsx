import React from 'react'
import Image from 'react-native-fast-image'
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native'

const url = 'https://foodsharing.de/images/'
    , avatar = 'https://foodsharing.de/img/130_q_avatar.png'

const styles = StyleSheet.create({
  container: {
    borderRadius: 30,
    overflow: 'hidden',
    aspectRatio: 1
  }
})

interface Props {
  photo: string
  style?: StyleProp<ViewStyle>
}

export default (props: Props) =>
  <View {...props} style={[styles.container, props.style || {}]}>
    <Image
      style={{flex: 1}}
      resizeMode="contain"
      source={{uri: props.photo ? url + '130_q_' + props.photo : avatar}}
    />
  </View>