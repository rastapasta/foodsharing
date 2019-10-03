import React, { PureComponent } from 'react'
import { StyleSheet, View, Text, Dimensions, TouchableOpacity } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { User, ConversationListEntry, Profile } from '../common/typings'

import moment from 'moment'

import RoundedImage from './RoundedImage'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as reduxActions from '../common/actions'

import colors from '../common/colors'
import { translate } from '../common/translation'
import { foodsaver } from '../common/placeholder'

const { width } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    width,
    height: width * 0.22 + 10,
    flexDirection: 'row'
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
  images: {
    width: width * 0.22,
    flexWrap: 'wrap',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
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
  conversation: {member: string[]} & ConversationListEntry,
  isLast: boolean,
  foodsavers: {string: User},
  profile: Profile
}

class ConversationsItem extends PureComponent<Props> {
  render() {
    const { conversation, isLast, foodsavers, profile } = this.props
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
        onPress={() => Actions.jump('conversation', {conversationId: id})}
      >
        <View style={styles.images}>
          {party.slice(0, 4).map(person =>
            <RoundedImage
              key={`${id}.${person}`}
              style={party.length > 1 ? {width: '48%', margin: '1%'} : {width: '100%'}}
              photo={foodsaver(foodsavers[person]).photo}
            />
          )}
        </View>

        <View style={{flex: 1, padding: 10}}>
          <View style={styles.header}>
            <View style={{flex: 1}}>
              <Text
                numberOfLines={1}
                style={[conversation.unread !== "0" && {color: colors.messageUnread}]}
              >
                {name ? name :
                  isSelfMessage ? translate('conversations.note_to_self') :
                  party.map(person => foodsaver(foodsavers[person]).name).join('|')
                }
              </Text>
            </View>
            <View>
              <Text style={styles.date}>
                {isYesterday ? translate('conversations.yesterday') : date.format(isToday ? 'HH:mm' : 'MMMM D')}
              </Text>
            </View>
          </View>

          <View style={[styles.lastMessage, !!isLast && {borderBottomWidth: 0}]}>
            {!!foodsaver(foodsavers[lastMessenger]).photo &&
              <View style={styles.lastMessageImage}>
                <RoundedImage photo={foodsavers[lastMessenger].photo} />
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
  foodsavers: state.foodsavers,
  profile: state.profile
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(reduxActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConversationsItem)
