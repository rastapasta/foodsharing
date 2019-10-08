import React, { useState } from 'react'
import { StyleSheet, View, Dimensions, Text, TouchableOpacity } from 'react-native'
import { Actions } from 'react-native-router-flux'
import moment from 'moment'
import Hyperlink from 'react-native-hyperlink'

import colors from '../common/colors'
import { translate } from '../common/translation'

import { Message } from '../common/typings'
import RoundedImage from './RoundedImage'

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
  },
  image: {
    width: 40,
    height: 40,
    marginLeft: 6,
    marginRight: 6,
    marginBottom: 8
  }
})

type Props = {
  type: string
  message: Message
  rawTime?: boolean
  mostRecent?: boolean
}

const MAX_LENGTH = 600

export default ({type, message, rawTime, mostRecent}: Props) => {
  const [expanded, setExpanded] = useState(false)
      , { body } = message
      , shortened = !expanded && body.length > MAX_LENGTH
      , text = expanded ? body : body.substr(0, MAX_LENGTH)

  return (
    <View style={[styles.container, {justifyContent: type === 'sent' ? 'flex-end' : 'flex-start'}]}>
      {type === 'received' &&
        <TouchableOpacity
          style={styles.image}
          onPress={() => Actions.push('profile', {id: message.fs_id})}
        >
          <RoundedImage photo={message.fs_photo} />
        </TouchableOpacity>
      }
      <View style={[styles.bubble, styles[type+'Bubble']]}>
        <Hyperlink linkDefault linkStyle={{color: colors.green}}>
          <Text>
            <Text style={[styles.message, styles[type+'Message']]} testID={mostRecent ? 'message.mostRecent' : 'message.' + message.id}>
              {text}
            </Text>
            {shortened && <Text style={styles[type+'Message']}>...{' '}
              <Text onPress={() => setExpanded(true)} style={{fontWeight: 'bold'}}>
                {translate('conversations.read_more')}
              </Text>
            </Text>}
          </Text>
          <Text style={[styles.time, styles[type+'Time']]}>
            {rawTime ? message.time : moment(message.time).format('HH:mm')}
          </Text>
        </Hyperlink>
      </View>
    </View>
  )
}