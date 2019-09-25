import React, { PureComponent } from 'react'
import { SafeAreaView, StyleSheet, FlatList } from 'react-native'

import colors from '../colors'
import { ConversationListing, login, getConversations } from '../api'

import ConversationsItem from '../components/ConversationsItem'

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
    conversations: [] as ConversationListing[]
  }

  async componentDidMount() {
    console.log(await login('m.strassburger@gmail.com', 'testtest'))
    const conversations = await getConversations()
    console.log(conversations)

    this.setState({conversations})
  }

  render() {
    const { conversations } = this.state
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          style={styles.list}
          data={conversations}
          renderItem={({item, index}) =>
            <ConversationsItem
              conversation={item}
              isLast={index === conversations.length - 1}
            />
          }
        />
      </SafeAreaView>
    )
  }
}
