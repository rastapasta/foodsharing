import React, { PureComponent, Fragment } from 'react'
import { Text, StyleSheet, Platform, TouchableOpacity } from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as reduxActions from '../common/actions'
import colors from '../common/colors'
import { foodsaver } from '../common/placeholder'
import { translate } from '../common/translation'
import { Actions } from 'react-native-router-flux'

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center'
  },
  title: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 17,
    textAlign: Platform.OS === 'ios' ? 'center' : 'left'
  },
  subtitle: {
    color: colors.white,
    fontWeight: '400',
    fontSize: 12,
    textAlign: Platform.OS === 'ios' ? 'center' : 'left'
  }
})

type Props = {
  conversationId: number
  showCount?: boolean

  actions: any
  conversations: any
  profile: any
  foodsavers: any
}

const showMemberCount = 4

class ConversationTitle extends PureComponent<Props> {
  render() {
    const { conversationId, conversations, profile, foodsavers, showCount } = this.props
        , conversation = conversations.find(conversation => conversation.id == conversationId) || {member: []}
        , otherMembers = conversation.member.filter(member => member != profile.id)
        , isNoteToSelf = otherMembers.length === 0

    return <TouchableOpacity
        style={styles.container}
        hitSlop={{top: 10, bottom: 10, left: 50, right: 50}}
        disabled={isNoteToSelf}
        onPress={() => otherMembers.length === 1 ?
          Actions.jump('profile', {id: otherMembers[0]}) :
          Actions.jump('groupchat', {conversationId})
        }
        testID="conversation.title"
      >
        {otherMembers.length > 1 ?
          <Fragment>
            <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit testID="conversation.title.label">
              {conversation.name || translate('conversations.groupchat')}
            </Text>
            <Text style={styles.subtitle} numberOfLines={1} adjustsFontSizeToFit>
              {showCount ?
                conversation.member.length + ' members' :
                otherMembers
                  .slice(0, showMemberCount)
                  .map(member => foodsaver(foodsavers[member]).name)
                  .join(', ')
                  + (conversation.member.length-1 > showMemberCount ? ', ...' : '')
              }
            </Text>
          </Fragment>
        :
          <Text style={styles.title} testID="conversation.title.label">
            {!conversation.member.length ? '' :
              isNoteToSelf ? translate('conversations.note_to_self') :
              foodsaver(foodsavers[otherMembers[0]]).name
            }
          </Text>
        }
      </TouchableOpacity>
  }
}

const mapStateToProps = state => ({
  conversations: state.conversations,
  profile: state.profile,
  foodsavers: state.foodsavers
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(reduxActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConversationTitle)
