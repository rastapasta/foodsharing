import React, { PureComponent } from 'react'
import { SafeAreaView, StyleSheet, Text, View, FlatList, Dimensions, KeyboardAvoidingView, Platform } from 'react-native'
import { AllHtmlEntities } from 'html-entities'

import moment from 'moment'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as reduxActions from '../common/actions'

import MessageForm from '../components/MessageForm'

import colors from '../common/colors'
import { ConversationListEntry, ConversationDetail, Message } from '../common/api'
import { translate } from '../common/translation'

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
  conversation: ConversationListEntry

  messages: any
  actions: any
  drafts: any
  profile: any
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
    const { conversation, messages, actions, drafts, profile } = this.props
        , data = (messages[conversation.id] || []) as Message[]

        , items = []

    let lastLabel = null
    data.forEach(item => {
      const { time } = item
        , date = moment(time)
        , isToday = date.isSame(new Date(), 'day')
        , isYesterday = date.isSame(new Date(Date.now() - 24*60*60*1000), 'day')
        , label = isToday ? translate('conversations.today') :
                  isYesterday ? translate('conversations.yesterday') :
                  date.format('MMMM Do')

      if (!lastLabel || lastLabel !== label) {
        if (lastLabel)
          items.push({type: 'seperator', label: lastLabel})
        lastLabel = label
      }

      items.push({type: `${item.fs_id}` === `${profile.id}` ? 'sent' : 'received', message: item})
    })
    if (lastLabel)
      items.push({type: 'seperator', label: lastLabel})

    return (
      <KeyboardAvoidingView
        {...(Platform.OS === 'ios' ? {behavior: 'padding'} : {})}
        enabled
        style={styles.form}
      >
        <SafeAreaView style={styles.container}>
          <FlatList
            inverted
            data={items}
            keyExtractor={item => item.label ? item.label : item.message.id.toString()}
            style={{flex: 1}}

            renderItem={({item: {type, label, message}}) => {
              switch(type) {
                case 'sent':
                case 'recieved':
                  return (
                    <View style={{alignItems: 'flex-end'}}>
                      <View style={styles.sentBubble}>
                        <Text style={styles.body}>
                          {entities.decode(message.body)}
                        </Text>
                        <Text style={styles.time}>
                          {moment(message.time).format('HH:mm')}
                        </Text>
                      </View>
                    </View>
                  )

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
  drafts: state.drafts,
  profile: state.profile
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(reduxActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Conversation)
