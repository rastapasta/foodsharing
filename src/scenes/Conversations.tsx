import React, { PureComponent } from 'react'
import { SafeAreaView, StyleSheet, FlatList, StatusBar } from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as reduxActions from '../common/actions'

import colors from '../common/colors'
import ConversationListEntry from '../components/ConversationListEntry'
import { withNavigationFocus } from 'react-navigation'

import { ConversationListEntry as ConversationListEntryType } from '../common/typings'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,

    alignItems: 'center',
    justifyContent: 'center'
  },
  list: {
    flex: 1
  }
})

type Props = {
  conversations: ConversationListEntryType[],
  actions?: any
  isFocused: boolean
}

class Conversations extends PureComponent<Props> {
  state = {
    refreshing: false
  }

  componentDidUpdate(prevProps: Props) {
    const { actions } = this.props
    if (prevProps.isFocused === false && this.props.isFocused === true)
      actions.navigation('conversations')
  }

  componentDidMount() {
    const { actions } = this.props
    actions.navigation('conversations')
    actions.fetchConversations()
  }

  render() {
    const { conversations, actions } = this.props
        , data = conversations.sort((a, b) => parseInt(b.last_ts) - parseInt(a.last_ts)).filter(conversation => conversation.last_ts)
        , { refreshing } = this.state
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={colors.background} barStyle="light-content" />

        <FlatList
          onRefresh={() => {
            actions.fetchConversations()
            setTimeout(() => this.setState({refreshing: false}), 1000)
          }}
          refreshing={refreshing}
          style={styles.list}
          data={data}
          renderItem={({item, index}) =>
            <ConversationListEntry
              conversation={item}
              isLast={index === data.length - 1}
            />
          }
        />
      </SafeAreaView>
    )
  }
}

const mapStateToProps = state => ({
  conversations: state.conversations
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(reduxActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigationFocus(Conversations))
