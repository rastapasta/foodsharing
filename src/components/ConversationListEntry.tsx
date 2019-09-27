import React, { PureComponent } from 'react'
import { StyleSheet, View, Text, Dimensions, TouchableOpacity } from 'react-native'
import { Actions } from 'react-native-router-flux'
import Image from 'react-native-fast-image'
import moment from 'moment'

import colors from '../utils/colors'
import { ConversationListEntry, ConversationMember } from '../utils/api'
import { translate } from '../utils/translation'

const { width } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    height: 80,
    width,
    flexDirection: 'row'
  },
  images: {
    width: 70,
    flexWrap: 'wrap',
    padding: 5,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  image: {
    flex: 1,
    borderRadius: 35,
    overflow: 'hidden'
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 3
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
  lastMessageImage: {
    width: 18,
    marginRight: 8
  },
  lastMessageText: {
    fontSize: 11,
    flex: 1,
    color: colors.messagePreview
  }
})

type Props = {
  conversation: ConversationListEntry,
  isLast: boolean
}

const ownUserId = "338605"
    , url = 'https://foodsharing.de/images/'
    , avatar = 'https://foodsharing.de/img/130_q_avatar.png'

const getOtherParty = (members: ConversationMember[]): ConversationMember =>
  members.length === 1 ? members[0] : members.find(member => member.id !== ownUserId)

export default class ConversationsItem extends PureComponent<Props> {
  render() {
    const { conversation, isLast } = this.props
        , { id, member, name, last_ts, last_message, last_foodsaver_id } = conversation
        , isSelfMessage = member.length === 1
        , other = getOtherParty(member)
        , party = member.length === 1 ? member : member.filter(member => member.id !== ownUserId)
        , date = moment(parseInt(last_ts) * 1000)
        , isToday = date.isSame(new Date(), 'day')
        , lastMessenger = member.find(member => member.id === last_foodsaver_id)

    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => Actions.jump('conversation', {conversation})}
      >
        <View style={styles.images}>
          {party.slice(0, 4).map(person =>
            <View key={`${id}.${person.id}`} style={styles.image}>
              <Image
                style={{flex: 1}}
                resizeMode="contain"
                source={{uri: person.photo ? url + other.photo : avatar}}
              />
            </View>
          )}
        </View>

        <View style={{flex: 1, padding: 10}}>
          <View style={styles.header}>
            <Text style={[conversation.unread !== "0" && {color: colors.messageUnread}]}>
              {name ? name :
                isSelfMessage ? translate('conversations.note_to_self') :
                party.map(person => person.name).join('|')
              }
            </Text>
            <Text style={styles.date}>
              {date.format(isToday ? 'HH:mm' : 'MMMM Do')}
            </Text>
          </View>

          <View style={[styles.lastMessage, !!isLast && {borderBottomWidth: 0}]}>
            {!!lastMessenger.photo &&
              <View style={styles.lastMessageImage}>
                <Image
                  style={{flex: 1}}
                  resizeMode="contain"
                  source={{uri: url + lastMessenger.photo}}
                />
              </View>
            }
            <Text style={styles.lastMessageText} numberOfLines={1} ellipsizeMode="tail">
              {last_message}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}
