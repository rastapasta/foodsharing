import React, { Component } from 'react'
import { SafeAreaView, StyleSheet, FlatList, StatusBar, View, Text } from 'react-native'
import _ from 'lodash'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as reduxActions from '../common/actions'

import colors from '../common/colors'
import ConversationListEntry from '../components/ConversationListEntry'
import { withNavigationFocus } from 'react-navigation'

import { ConversationListEntry as ConversationListEntryType } from '../common/typings'
import { translate } from '../common/translation'

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

class Conversations extends Component<Props> {
  state = {
    refreshing: false
  }

  shouldComponentUpdate(next: Props) {
    const { conversations } = this.props
    return next.conversations.length !== conversations.length
        || (next.conversations.length && !next.conversations.every(
          (conversation, idx) => _.isEqual(
            _.omit(conversations[idx], ['loading', 'fullyLoaded', 'sending']),
            _.omit(conversation, ['loading', 'fullyLoaded', 'sending'])
          ))
        )
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
        , data = conversations.filter(conversation => conversation.last_ts)
        , { refreshing } = this.state

    return (
      <SafeAreaView style={styles.container} testID="conversations.scene">
        <StatusBar backgroundColor={colors.background} barStyle="light-content" />
        {data.length ?
          <FlatList
            keyExtractor={item => item.id.toString()}
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
                testID={'conversations.'+index}
                isLast={index === data.length - 1}
              />
            }
          />
        : <View style={{padding: 10}}>
            <Text style={{textAlign: 'center'}}>
              {translate('conversations.no_conversations')}
            </Text>
          </View>
      }
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
