import React, { PureComponent } from 'react'
import { SafeAreaView, StyleSheet, FlatList, View, Text, Dimensions, Image } from 'react-native'
import colors from '../colors'
import { Conversation, ConversationMember } from '../api'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,

    alignItems: 'center',
    justifyContent: 'center'
  }
})

const { width } = Dimensions.get('window')
const data = [
  {
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
] as Conversation[]
type Props = {}

const ownUserId = "338605"

const getOtherParty = (members: ConversationMember[]): ConversationMember =>
  members.length === 1 ? members[0] : members.find(member => member.id !== ownUserId)

export default class Conversations extends PureComponent<Props> {
  async componentDidMount() {
    // console.log(await authenticate('m.strassburger@gmail.com', 'testtest'))
    // const conversations = await getConversations()
    // console.log(conversations)
  }

  renderItem({item: {member}}) {
    const other = getOtherParty(member)
    return (
      <View
        style={{height: 70, width, flexDirection: 'row'}}
      >
        <View style={{width: 70, borderRadius: 35, padding: 10, overflow: 'hidden'}}>
          {other.photo &&
            <Image
              style={{flex: 1}}
              resizeMode="contain"
              source={{uri: 'https://foodsharing.de/images/' + other.photo}}
            />
          }
        </View>
        <View style={{flex: 1, padding: 10}}>
          <Text>{other.name}</Text>
        </View>
      </View>
    )
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          style={{flex: 1}}
          data={data}
          renderItem={this.renderItem}
        />
      </SafeAreaView>
    )
  }
}
