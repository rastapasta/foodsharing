import React, { PureComponent } from 'react'
import { SafeAreaView, StyleSheet, Text, View, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native'

import moment from 'moment'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as reduxActions from '../common/actions'
import { withNavigationFocus } from 'react-navigation'

import MessageForm from '../components/MessageForm'
import MessageBubble from '../components/MessageBubble'
import { ConversationDetail, Message, MessageType, ConversationListEntry } from '../common/typings'

import colors from '../common/colors'
import { translate } from '../common/translation'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  form: {
    flex: 1
  },

  seperator: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },

  seperatorText: {
    color: colors.seperatorText
  }
})

type Props = {
  conversationId: number

  isFocused: boolean
  messages: any
  actions: any
  drafts: any
  profile: any
  conversations: any
}

interface Item {
  type: 'seperator' | 'received' | 'sent'
  label?: string
  message: Message
}

class Conversation extends PureComponent<Props> {
  state = {
    data: {} as ConversationDetail,
    refreshing: false,
    loading: false
  }

  componentDidUpdate(prevProps: Props) {
    const { actions, conversationId } = this.props
    if (prevProps.isFocused === false && this.props.isFocused === true)
      actions.navigation('conversation', conversationId)
  }

  componentDidMount() {
    const { conversationId, actions } = this.props
    actions.navigation('conversation', conversationId)
    actions.fetchConversation(conversationId)
  }

  prepareItems(messages: Message[]): Item[] {
    const data = []
    let lastLabel = null

    // TODO: this is kinda intensive for conversations with many many message
    // -> find better solution?
    messages.forEach(message => {
      const { time } = message
        , date = moment(time)
        , isToday = date.isSame(new Date(), 'day')
        , isYesterday = date.isSame(new Date(Date.now() - 24*60*60*1000), 'day')
        , thisYear = date.isSame(new Date(), 'year')
        , label = isToday ? translate('conversations.today') :
                  isYesterday ? translate('conversations.yesterday') :
                  thisYear ? date.format('LL').split(/,* \d{4}$/)[0] :
                  date.format('LL')

      if (lastLabel !== label && lastLabel)
        data.push({type: 'seperator', label: lastLabel})
      lastLabel = label

      data.push({
        type: message.type === MessageType.SENT ? 'sent' : 'received',
        message
      })
    })

    if (lastLabel)
      data.push({type: 'seperator', label: lastLabel})

    return data
  }

  render() {
    const { conversationId, conversations, messages, actions, drafts } = this.props
        , { refreshing } = this.state
        , data = (messages[conversationId] || []) as Message[]
        , conversation = (conversations.find(c => c.id == conversationId) || {}) as ConversationListEntry
        , items = this.prepareItems(data)

    return (
      <KeyboardAvoidingView
        {...(Platform.OS === 'ios' ? {behavior: 'padding'} : {})}
        enabled
        style={styles.form}
        testID="conversation.scene"
      >
        <SafeAreaView style={styles.container}>
          <FlatList
            onEndReached={() => {
              if (!conversation.loading && !conversation.fullyLoaded)
                actions.fetchConversation(conversationId, data.length - 1)
            }}
            onEndReachedThreshold={5}
            onRefresh={Platform.OS === 'ios' ? () => {
              actions.fetchConversation(conversationId)
              setTimeout(() => this.setState({refreshing: false}), 1000)
            } : null}
            refreshing={refreshing}
            inverted
            data={items}
            keyExtractor={item => item.label ? item.label : item.message.id.toString()}
            style={{flex: 1}}

            ListFooterComponent={() => <View style={{height: 100, alignItems: 'center', justifyContent: 'center'}}>
              {conversation.loading && <ActivityIndicator />}
            </View>}

            renderItem={({item: {type, label, message}, index}) => {
              switch(type) {
                case 'sent':
                case 'received':
                  return <MessageBubble type={type} message={message} mostRecent={index === 0} />

                case 'seperator':
                  return (
                    <View style={styles.seperator}>
                      <Text style={styles.seperatorText}>
                        {label}
                      </Text>
                    </View>
                  )

                default:
                  return <View />
              }
            }}
          />

          <MessageForm
            onSend={() => actions.sendMessage(conversationId)}
            model={`drafts.${conversationId}`}
            active={!!drafts[conversationId] && drafts[conversationId] !== '0'}
            sending={conversation.sending}
          />
        </SafeAreaView>
      </KeyboardAvoidingView>
    )
  }
}

const mapStateToProps = state => ({
  messages: state.messages,
  drafts: state.drafts,
  conversations: state.conversations
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(reduxActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigationFocus(Conversation))
