import React, { PureComponent } from 'react'
import { SafeAreaView, StyleSheet, FlatList, StatusBar } from 'react-native'

import colors from '../utils/colors'
import { ConversationListEntry as ListEntry, getConversations } from '../utils/api'

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

type Props = {}

export default class Conversations extends PureComponent<Props> {
  state = {
    conversations: [] as ListEntry[]
  }

  async componentDidMount() {
    const conversations = await getConversations()
    this.setState({conversations})
  }

  render() {
    const { conversations } = this.state
    console.log(conversations)
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
