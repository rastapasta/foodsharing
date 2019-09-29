import React, { PureComponent } from 'react'
import { StyleSheet, View, Text, Dimensions, TouchableOpacity } from 'react-native'
import { Actions } from 'react-native-router-flux'
import Image from 'react-native-fast-image'
import moment from 'moment'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as reduxActions from '../common/actions'

import colors from '../common/colors'
import { translate } from '../common/translation'

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
    padding: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  image: {
    flex: 1,
    borderRadius: 30,
    overflow: 'hidden',
    aspectRatio: 1
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
  conversation: {member: string[]} & Foodsharing.ConversationListEntry,
  isLast: boolean,
  foodsharers: {string: Foodsharing.User},
  profile: Foodsharing.Profile
}

const url = 'https://foodsharing.de/images/'
    , avatar = 'https://foodsharing.de/img/130_q_avatar.png'

class ConversationsItem extends PureComponent<Props> {
  render() {
    const { conversation, isLast, foodsharers, profile } = this.props
        , { id, member, name, last_ts, last_message, last_foodsaver_id } = conversation

        , isSelfMessage = member.length === 1
        , party = member.length === 1 ? member : member.filter(member => member !== (profile.id || '').toString())
        , date = moment(parseInt(last_ts) * 1000)
        , isToday = date.isSame(new Date(), 'day')
        , isYesterday = date.isSame(new Date(Date.now() - 24*60*60*1000), 'day')
        , lastMessenger = member.find(member => member === last_foodsaver_id)

    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => Actions.jump('conversation', {conversation})}
      >
        <View style={styles.images}>
          {party.slice(0, 4).map(person =>
            <View key={`${id}.${person}`} style={styles.image}>
              <Image
                style={{flex: 1}}
                resizeMode="contain"
                source={{uri: foodsharers[person].photo ? url + '130_q_' + foodsharers[person].photo : avatar}}
              />
            </View>
          )}
        </View>

        <View style={{flex: 1, padding: 10}}>
          <View style={styles.header}>
            <Text style={[conversation.unread !== "0" && {color: colors.messageUnread}]}>
              {/* TODO: handle too long strings */}
              {name ? name :
                isSelfMessage ? translate('conversations.note_to_self') :
                party.map(person => foodsharers[person].name).join('|')
              }
            </Text>
            <Text style={styles.date}>
              {isYesterday ? translate('conversations.yesterday') : date.format(isToday ? 'HH:mm' : 'MMMM Do')}
            </Text>
          </View>

          <View style={[styles.lastMessage, !!isLast && {borderBottomWidth: 0}]}>
            {!!foodsharers[lastMessenger].photo &&
              <View style={styles.lastMessageImage}>
                <Image
                  style={{flex: 1}}
                  resizeMode="contain"
                  source={{uri: url + '130_q_' + foodsharers[lastMessenger].photo}}
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

const mapStateToProps = state => ({
  foodsharers: state.foodsharers,
  profile: state.profile
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(reduxActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConversationsItem)
