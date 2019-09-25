import React, { PureComponent } from 'react'
import { SafeAreaView, StyleSheet, FlatList } from 'react-native'

import colors from '../colors'
import { Conversation, ConversationMember } from '../api'

import ConversationsItem from '../components/ConversationsItem'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,

    alignItems: 'center',
    justifyContent: 'center'
  }
})

const tmp = {
  "id": "1357698",
  "last": "2019-09-25 04:02:27",
  "last_ts": "1569376947",
  "member": [
    {
      "id": "338605",
      "name": "Michael",
      "photo": "",
      "email": "m.strassburger@gmail.com",
      "geschlecht": "1",
      "infomail_message": "1"
    },
    {
      "id": "338241",
      "name": "Michael",
      "photo": "131cdf95730f220a538544358e392681.png",
      "email": "michael@regensburg.re",
      "geschlecht": "1",
      "infomail_message": "1"
    }
  ],
  "last_message": "Aloha Testaccount! :)",
  "last_foodsaver_id": "338241",
  "unread": "1",
  "name": "",
  "last_message_is_htmlentity_encoded": "1"
}

const data = [{...tmp, id: "1"}, {...tmp, id: "2"}, {...tmp, id: "3"}, {...tmp, id: "4"}] as Conversation[]
type Props = {}

export default class Conversations extends PureComponent<Props> {
  async componentDidMount() {
    // console.log(await authenticate('m.strassburger@gmail.com', 'testtest'))
    // const conversations = await getConversations()
    // console.log(conversations)
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          style={{flex: 1}}
          data={data}
          renderItem={({item, index}) => <ConversationsItem conversation={item} isLast={index === data.length - 1} />}
        />
      </SafeAreaView>
    )
  }
}
