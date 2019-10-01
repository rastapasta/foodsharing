import React from 'react'
import Image from 'react-native-fast-image'
import { StyleSheet, View } from 'react-native'

const url = 'https://foodsharing.de/images/'
    , avatar = 'https://foodsharing.de/img/130_q_avatar.png'


const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 30,
    overflow: 'hidden',
    aspectRatio: 1
  }
})

interface Props {
  photo: string
}

export default (props: Props) =>
  <View style={styles.container} {...props}>
    <Image
      style={{flex: 1}}
      resizeMode="contain"
      source={{uri: props.photo ? url + '130_q_' + props.photo : avatar}}
    />
  </View>