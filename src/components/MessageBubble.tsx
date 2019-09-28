import React from 'react'
import { StyleSheet, View, Dimensions, Text } from 'react-native'
import { AllHtmlEntities } from 'html-entities'

import Image from 'react-native-fast-image'

import Linkify from './Linkify'

import colors from '../common/colors'
import { Message } from '../common/api'

import moment from 'moment'

const entities = new AllHtmlEntities()

const { width } = Dimensions.get('window')
    , bubbleRadius = 12

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  bubble: {
    maxWidth: width * 0.7,
    borderTopLeftRadius: bubbleRadius,
    borderTopRightRadius: bubbleRadius,
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 10,
    marginRight: 10,
    marginBottom: 10
  },
  sentBubble: {
    borderBottomLeftRadius: bubbleRadius,
    backgroundColor: colors.messageSentBubble
  },
  receivedBubble: {
    borderBottomRightRadius: bubbleRadius,
    backgroundColor: colors.messageReceivedBubble
  },
  message: {
  },
  receivedMessage: {
    color: colors.messageReceivedText
  },
  sentMessage: {
    color: colors.messageSentText
  },
  time: {
    right: 0,
    fontSize: 11,
    marginTop: 3,
    marginBottom: 7,
    textAlign: 'right',
  },
  receivedTime: {
    color: colors.messageRecievedTime
  },
  sentTime: {
    color: colors.messageSentTime
  }
})

type Props = {
  type: string
  message: Message
}

const avatar = 'https://foodsharing.de/img/130_q_avatar.png'
    , url = 'https://foodsharing.de/images/'

export default ({type, message}: Props) =>
  <View style={[styles.container, {justifyContent: type === 'sent' ? 'flex-end' : 'flex-start'}]}>
    {type === 'received' &&
      <Image
        source={{uri: message.fs_photo ? url + '130_q_' + message.fs_photo : avatar}}
        style={{
          width: 40,
          height: 40,
          marginLeft: 6,
          marginRight: 6,
          marginBottom: 10
        }}
        resizeMode="contain"
      />
    }
    <View style={[styles.bubble, styles[type+'Bubble']]}>
      <Linkify
        style={[styles.message, styles[type+'Message']]}
        text={entities.decode(message.body)}
      />
      <Text style={[styles.time, styles[type+'Time']]}>
        {moment(message.time).format('HH:mm')}
      </Text>
    </View>
  </View>