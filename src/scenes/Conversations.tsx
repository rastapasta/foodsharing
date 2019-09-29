import React, { PureComponent } from 'react'
import { SafeAreaView, StyleSheet, FlatList, StatusBar } from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as reduxActions from '../common/actions'

import colors from '../common/colors'
import ConversationListEntry from '../components/ConversationListEntry'

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
}

class Conversations extends PureComponent<Props> {
  state = {
    refreshing: false
  }

  componentDidMount() {
    const { actions } = this.props
    actions.fetchConversations()
  }

  render() {
    const { conversations, actions } = this.props
        , data = conversations.sort((a, b) => parseInt(b.last_ts) - parseInt(a.last_ts))
        , { refreshing } = this.state
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={colors.background} barStyle="light-content" />

        <FlatList
          onRefresh={() => {
            actions.fetchConversations()

            // TODO: hook this into redux
            setTimeout(() => this.setState({refreshing: false}), 1000)
          }}
          refreshing={refreshing}
          style={styles.list}
          data={data}
          renderItem={({item, index}) =>
            <ConversationListEntry
              conversation={item}
              isLast={index === conversations.length - 1}
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
)(Conversations)
