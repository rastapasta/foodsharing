import React, { PureComponent } from 'react'
import { SafeAreaView, StyleSheet, Text, View, SectionList, Dimensions } from 'react-native'
import moment from 'moment'

import colors from '../colors'
import { ConversationListing, getConversation } from '../api'

const { width } = Dimensions.get('window')

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
  title: {
    color: colors.gray,
    fontSize: 13
  },
  body: {
    color: colors.white
  }
})

type Props = {
  conversation: ConversationListing
}

const data = {
  "name": null,
  "member": [
    {
      "id": 338605,
      "name": "Michael",
      "avatar": "",
      "sleepStatus": null
    },
    {
      "id": 338241,
      "name": "Michael",
      "avatar": "131cdf95730f220a538544358e392681.png",
      "sleepStatus": null
    }
  ],
  "members": [
    {
      "id": 338605,
      "name": "Michael",
      "avatar": "",
      "sleepStatus": null
    },
    {
      "id": 338241,
      "name": "Michael",
      "avatar": "131cdf95730f220a538544358e392681.png",
      "sleepStatus": null
    }
  ],
  "messages": [
    {
      "id": 10339156,
      "fs_id": 33824,
      "fs_name": "Michael",
      "fs_photo": "131cdf95730f220a538544358e392681.png",
      "body": "Loren weiwer wire iweriweriwer werjwiejr weijrwierjw either eijrwierjwoierj wioerj woeirjw woeirjw woeirjw woeirjw eorijweori jweorjweorijw eoirjwoerjw sewer were wet wet wet",
      "time": "2019-09-25 08:44:20",
      "is_htmlentity_encoded": 1
    },
    {
      "id": 10339147,
      "fs_id": 338241,
      "fs_name": "Michael",
      "fs_photo": "131cdf95730f220a538544358e392681.png",
      "body": "wie geht es dir? :)",
      "time": "2019-09-25 08:42:37",
      "is_htmlentity_encoded": 1
    },
    {
      "id": 10338441,
      "fs_id": 338241,
      "fs_name": "Michael",
      "fs_photo": "131cdf95730f220a538544358e392681.png",
      "body": "Aloha Testaccount! :)",
      "time": "2019-09-25 04:02:27",
      "is_htmlentity_encoded": 1
    }
  ]
}

export default class Conversation extends PureComponent<Props> {
  // async componentDidMount() {
  //   const { conversation } = this.props
  //   console.log(await getConversation(parseInt(conversation.id)))
  // }

  render() {
    // const { conversation } = this.props
    const radius = 12

    return (
      <SafeAreaView style={styles.container}>
        <SectionList
          style={{flex: 1}}
          inverted
          sections={[
            {title: '', data: data.messages},
            {title: 'Today', data: data.messages},
            {title: 'Yesterday', data: data.messages},
            {title: 'dd Yesterday', data: data.messages},
            {title: 'fff Yesterday', data: data.messages},
          ]}
          keyExtractor={message => message.id.toString()}
          renderSectionHeader={({section}) =>
            <View style={styles.header}>
              <Text style={styles.title}>
                {section.title}
              </Text>
            </View>
          }
          renderItem={({item: message}) =>
            <View style={{alignItems: 'flex-end'}}>
              <View style={{
                maxWidth: width * 0.7,
                backgroundColor: colors.background,
                borderTopLeftRadius: radius,
                borderBottomLeftRadius: radius,
                borderTopRightRadius: radius,
                paddingLeft: 12,
                paddingRight: 12,
                paddingTop: 10,
                marginRight: 10,
                marginBottom: 10
              }}>
                <Text style={styles.body}>
                  {message.body}
                </Text>
                <Text style={{
                  textAlign: 'right',
                  right: 0,
                  fontSize: 11,
                  marginTop: 3,
                  marginBottom: 7,
                  color: colors.white
                }}>
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
