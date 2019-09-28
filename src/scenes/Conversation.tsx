import React, { PureComponent } from 'react'
import { SafeAreaView, StyleSheet, Text, View, FlatList, Dimensions, KeyboardAvoidingView } from 'react-native'
import { AllHtmlEntities } from 'html-entities'

import moment from 'moment'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as reduxActions from '../common/actions'

import MessageForm from '../components/MessageForm'

import colors from '../common/colors'
import { ConversationListEntry, ConversationDetail, Message } from '../common/api'

const entities = new AllHtmlEntities()

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
  messages?: any
  actions?: any
  drafts?: any
}

class Conversation extends PureComponent<Props> {
  state = {
    data: {} as ConversationDetail
  }

  async componentDidMount() {
    const { conversation, actions } = this.props
    actions.fetchConversation(conversation.id)
  }

  // TODO: make sure to only rerender if conversation is affected @redux state
  // shouldComponentUpdate() {
  //   return true
  // }

  render() {
    const { conversation, messages, actions, drafts } = this.props
        , data = (messages[conversation.id] || []) as Message[]

    return (
      <KeyboardAvoidingView behavior="padding" enabled style={styles.form}>
        <SafeAreaView style={styles.container}>
          <FlatList
            inverted
            data={data}
            keyExtractor={message => message.id.toString()}
            style={{flex: 1}}

            renderItem={({item: message}) =>
              <View style={{alignItems: 'flex-end'}}>
                <View style={styles.sentBubble}>
                  <Text style={styles.body}>
                    {entities.decode(message.body)}
                  </Text>
                  <Text style={styles.time}>
                    {moment(message.time).format('hh:mm')}
                  </Text>
                </View>
              </View>
            }
          />

          <MessageForm
            onSend={() => actions.sendMessage(conversation.id)}
            model={`drafts.${conversation.id}`}
            active={!!drafts[conversation.id]}
          />
        </SafeAreaView>
      </KeyboardAvoidingView>
    )
  }
}

const mapStateToProps = state => ({
  messages: state.messages,
  drafts: state.drafts
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(reduxActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Conversation)
