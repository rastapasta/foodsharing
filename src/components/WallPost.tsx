import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Actions } from 'react-native-router-flux'

import { formatDate } from '../common/utils'

import colors from '../common/colors'
import RoundedImage from './RoundedImage'
import FastImage from 'react-native-fast-image'

const styles = StyleSheet.create({
  container: {
    padding: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  image: {
    width: '10%'
  },
  content: {
    flex: 1,
    marginLeft: 14
  },
  body: {
    fontSize: 12
  },
  time: {
    color: colors.gray,
    fontSize: 12,
    marginTop: 2
  }
})

export default ({item}) => {
  const text = item.body.trim()
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.image}
        onPress={() => Actions.push('profile', {id: item.author.id})}
      >
        <RoundedImage
          photo={item.author.avatar}
        />
      </TouchableOpacity>

      <View style={styles.content}>
        {!!text && <Text style={styles.body}>
          {text}
        </Text>}
        {item.pictures && item.pictures.map(picture =>
            <FastImage
              key={picture.image}
              style={{height: 200, marginTop: 5}}
              resizeMode="contain"
              source={{uri: 'https://foodsharing.de/' + picture.image}}
            />
        )}
        <Text style={styles.time}>
          {formatDate(item.createdAt)}
        </Text>
      </View>
    </View>
  )
}