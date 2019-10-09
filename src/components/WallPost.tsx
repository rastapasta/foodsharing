import React, { PureComponent } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Actions } from 'react-native-router-flux'

import { WallPost as WallPostType } from '../common/typings'
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

type Props = {
  item: WallPostType
}

export default class WallPost extends PureComponent<Props> {
  render() {
    const { body, author, pictures, createdAt } = this.props.item
        ,  text = body.trim()

    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.image}
          onPress={() => Actions.push('profile', {id: author.id})}
        >
          <RoundedImage
            photo={author.avatar}
          />
        </TouchableOpacity>

        <View style={styles.content}>
          {!!text && <Text style={styles.body}>
            {text}
          </Text>}
          {pictures && pictures.map(picture =>
            <FastImage
              key={picture.image}
              style={{height: 200, marginTop: 5}}
              resizeMode="contain"
              source={{uri: 'https://foodsharing.de/' + picture.image}}
            />
          )}
          <Text style={styles.time}>
            {formatDate(createdAt)}
          </Text>
        </View>
      </View>
    )
  }
}