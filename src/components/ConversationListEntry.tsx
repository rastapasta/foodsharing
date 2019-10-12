import React, { Component } from 'react'
import { Actions } from 'react-native-router-flux'
import { User, ConversationListEntry, Profile } from '../common/typings'

import CommonListEntry from './CommonListEntry'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as reduxActions from '../common/actions'

import { translate } from '../common/translation'
import { foodsaver } from '../common/placeholder'


type Props = {
  conversation: {member: string[]} & ConversationListEntry,
  testID: string,
  isLast: boolean,
  foodsavers: {string: User},
  profile: Profile
}

class ConversationsItem extends Component<Props> {
  shouldComponentUpdate(next: Props) {
    const { testID, isLast, profile, conversation } = this.props

    return next.testID !== testID
        || next.isLast !== isLast
        || next.profile.id !== profile.id
        || next.conversation !== conversation
  }

  render() {
    const { conversation, testID, isLast, foodsavers, profile } = this.props
        , { id, member, name, last_ts, last_message, last_foodsaver_id } = conversation

        , isSelfMessage = member.length === 1 && profile.id && member[0] == profile.id.toString()
        , party = member.length === 1 ? member : member.filter(member => member !== (profile.id || '').toString())
        , lastMessenger = member.find(member => member === last_foodsaver_id)
        , isUnread = conversation.unread !== "0"
        , title = name ? name :
            isSelfMessage ? translate('conversations.note_to_self') :
            party.map(person => foodsaver(foodsavers[person]).name).join('|')

    return <CommonListEntry
      pictures={party.map(person => foodsaver(foodsavers[person]).photo)}
      onPress={() => Actions.jump('conversation', {conversationId: id})}
      testID={testID}
      title={title}
      timestamp={parseInt(last_ts)*1000}
      subtitlePhoto={foodsaver(foodsavers[lastMessenger]).photo}
      subtitle={last_message}
      isLast={isLast}
      isUnread={isUnread}
    />
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
