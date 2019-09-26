import React, { PureComponent } from 'react'
import { SafeAreaView, StyleSheet, Text, View, FlatList, Dimensions, KeyboardAvoidingView } from 'react-native'
import moment from 'moment'

import MessageForm from '../components/MessageForm'

import colors from '../colors'
import { ConversationListEntry, getConversation, ConversationDetail, sendMessage } from '../api'

const { width } = Dimensions.get('window')
    , bubbleRadius = 12

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  form: {
    flex: 1
  },
  header: {
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },

  sentBubble: {
    maxWidth: width * 0.7,
    backgroundColor: colors.background,
    borderTopLeftRadius: bubbleRadius,
    borderBottomLeftRadius: bubbleRadius,
    borderTopRightRadius: bubbleRadius,
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 10,
    marginRight: 10,
    marginBottom: 10
  },
  title: {
    color: colors.gray,
    fontSize: 13
  },
  body: {
    color: colors.white
  },
  time: {
    textAlign: 'right',
    right: 0,
    fontSize: 11,
    marginTop: 3,
    marginBottom: 7,
    color: colors.white
  },
})

type Props = {
  conversation: ConversationListEntry
}

export default class Conversation extends PureComponent<Props> {
  state = {
    data: {} as ConversationDetail
  }

  async componentDidMount() {
    const { conversation } = this.props
    const data = await getConversation(parseInt(conversation.id))
    this.setState({data})
  }

  async sendMessage(text: string) {
    // sendMessage()
    return true
  }

  render() {
    const { data } = this.state

    return (
      <KeyboardAvoidingView behavior="padding" enabled style={styles.form}>
        <SafeAreaView style={styles.container}>
          <FlatList
            inverted
            data={data.messages}
            keyExtractor={message => message.id.toString()}
            style={{flex: 1}}

            renderItem={({item: message}) =>
              <View style={{alignItems: 'flex-end'}}>
                <View style={styles.sentBubble}>
                  <Text style={styles.body}>
                    {message.body}
                  </Text>
                  <Text style={styles.time}>
                    {moment(message.time).format('hh:mm')}
                  </Text>
                </View>
              </View>
            }
          />

          <MessageForm onSend={this.sendMessage} />
        </SafeAreaView>
      </KeyboardAvoidingView>
    )
  }
}
