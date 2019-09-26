import React, { PureComponent } from 'react'
import { SafeAreaView, StyleSheet, Text, View, FlatList, Dimensions } from 'react-native'
import moment from 'moment'

import colors from '../colors'
import { ConversationListEntry, getConversation, ConversationDetail } from '../api'

const { width } = Dimensions.get('window')
    , bubbleRadius = 12

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,

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
  }
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

  render() {
    const { data } = this.state

    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          style={{flex: 1}}
          inverted
          data={data.messages}
          keyExtractor={message => message.id.toString()}
          // renderSectionHeader={({section}) =>
          //   <View style={styles.header}>
          //     <Text style={styles.title}>
          //       {section.title}
          //     </Text>
          //   </View>
          // }
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
      </SafeAreaView>
    )
  }
}
