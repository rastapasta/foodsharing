import React, { PureComponent } from 'react'
import { SafeAreaView, StyleSheet, FlatList, StatusBar } from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as reduxActions from '../actions'

import colors from '../utils/colors'

import { ConversationListEntry as ListEntry } from '../utils/api'

import ConversationListEntry from '../components/ConversationListEntry'

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
  conversations: ListEntry[]
}

class Conversations extends PureComponent<Props> {
  async componentDidMount() {
    const { actions } = this.props as any
    actions.fetchConversations()
  }

  render() {
    const { conversations } = this.props
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={colors.background} barStyle="light-content" />

        <FlatList
          style={styles.list}
          data={conversations}
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
