import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, Platform } from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as reduxActions from '../common/actions'
import colors from '../common/colors'
import { foodsaver } from '../common/placeholder'
import { translate } from '../common/translation'

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

  actions: any
  conversations: any
  profile: any
  foodsavers: any
}

const showMemberCount = 4

class ConversationTitle extends PureComponent<Props> {
  render() {
    const { conversationId, conversations, profile, foodsavers } = this.props
        , conversation = conversations.find(conversation => conversation.id == conversationId) || {member: []}

    return conversation.member.length > 2 ?
      <View style={styles.container}>
        <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>
          {conversation.name || 'Gruppenchat'}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1} adjustsFontSizeToFit>
          {conversation.member
            .filter(member => member != profile.id)
            .slice(0, showMemberCount)
            .map(member => foodsaver(foodsavers[member]).name)
            .join(', ')
          }{conversation.member.length-1 > showMemberCount ? ', ...' : ''}
        </Text>
      </View>
      :
      <Text style={styles.title}>
        {conversation.member.length === 1 ?
          translate('conversations.note_to_self') :
          foodsaver(foodsavers[conversation.member[0]]).name
        }
      </Text>
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
