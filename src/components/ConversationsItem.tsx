import React, { PureComponent } from 'react'
import { StyleSheet, View, Text, Dimensions, TouchableOpacity } from 'react-native'
import Image from 'react-native-fast-image'
import moment from 'moment'

import colors from '../colors'
import { Conversation, ConversationMember } from '../api'

const { width } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    height: 80,
    width,
    flexDirection: 'row'
  },
  image: {
    width: 70,
    borderRadius: 35,
    paddingTop: 10,
    paddingBottom: 20,
    overflow: 'hidden'
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  date: {
    color: colors.conversationDate,
    fontSize: 11
  },
  lastMessage: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingBottom: 10
  },
  lastMessageText: {
    fontSize: 11,
    color: colors.background
  }
})

type Props = {
  conversation: Conversation,
  isLast: boolean
}

const ownUserId = "338605"
    , url = 'https://foodsharing.de/images/'

const getOtherParty = (members: ConversationMember[]): ConversationMember =>
  members.length === 1 ? members[0] : members.find(member => member.id !== ownUserId)

export default class ConversationsItem extends PureComponent<Props> {
  render() {
    const { conversation: { member, last_ts, last_message, last_foodsaver_id }, isLast } = this.props
        , other = getOtherParty(member)
        , date = moment(parseInt(last_ts) * 1000)
        , isToday = date.isSame(new Date(), 'day')

    return (
      <TouchableOpacity style={styles.container}>
        <View style={styles.image}>
          {other.photo &&
            <Image
              style={{flex: 1}}
              resizeMode="contain"
              source={{uri:  url + other.photo}}
            />
          }
        </View>
        <View style={{flex: 1, padding: 10}}>
          <View style={styles.header}>
            <Text>
              {other.name}
            </Text>
            <Text style={styles.date}>
              {date.format(isToday ? 'hh:mm' : 'MMMM Do')}
            </Text>
          </View>

          <View style={[styles.lastMessage, !!isLast && {borderBottomWidth: 0}]}>
            {last_foodsaver_id !== ownUserId &&
              <View style={{width: 18, marginRight: 8}}>
                <Image
                  style={{flex: 1}}
                  resizeMode="contain"
                  source={{uri: url + member.find(m => m.id === last_foodsaver_id).photo}}
                />
              </View>
            }
            <Text style={styles.lastMessageText}>
              {last_message}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}
