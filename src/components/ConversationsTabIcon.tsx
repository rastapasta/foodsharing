import React, { Component } from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as reduxActions from '../common/actions'
import colors from '../common/colors'

import { withBadge } from 'react-native-elements'
import { ConversationListEntry } from '../common/typings'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

type Props = {
  focused: boolean
  conversations: ConversationListEntry[]
}

const sum = (data: ConversationListEntry[]) =>
  data.reduce((sum, conversation) => conversation.unread === "0" ? sum : 1, 0)

class ConversationsTabIcon extends Component<Props> {
  nextSum = null

  shouldComponentUpdate(next: Props) {
    return sum(next.conversations) !== sum(this.props.conversations)
  }

  render() {
    const { focused, conversations } = this.props
        , badge = sum(conversations)

    const Component = badge ? withBadge(badge)(Icon) : Icon
    return (
      <Component
        testID={`navigation.conversations`}
        name="wechat"
        size={32}
        style={{marginTop: 3, color:
          focused ? colors.navigationTabActive :
          colors.navigationTabInactive
        }}
      />
    )
  }
}

const mapStateToProps = state => ({
  conversations: state.conversations,
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(reduxActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConversationsTabIcon)
