import React, { PureComponent } from 'react'
import { SafeAreaView, StyleSheet, FlatList, View, Text, Dimensions, TouchableOpacity } from 'react-native'
import Image from 'react-native-fast-image'
import moment from 'moment'

import colors from '../colors'
import { Conversation, ConversationMember } from '../api'

const { width } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,

    alignItems: 'center',
    justifyContent: 'center'
  },
  row: {
    height: 80,
    width,
    flexDirection: 'row'
  },
  image: {
    width: 70,
    borderRadius: 35,
    paddingTop: 10,
    paddingBottom: 20,
    overflow: 'hidden'
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  date: {
    color: colors.conversationDate,
    fontSize: 11
  },
  lastMessage: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingBottom: 10
  },
  lastMessageText: {
    fontSize: 11,
    color: colors.background
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

const data = [{...tmp}, {...tmp}, {...tmp}, {...tmp}] as Conversation[]
type Props = {}

const ownUserId = "338605"
    , url = 'https://foodsharing.de/images/'

const getOtherParty = (members: ConversationMember[]): ConversationMember =>
  members.length === 1 ? members[0] : members.find(member => member.id !== ownUserId)

export default class Conversations extends PureComponent<Props> {
  async componentDidMount() {
    // console.log(await authenticate('m.strassburger@gmail.com', 'testtest'))
    // const conversations = await getConversations()
    // console.log(conversations)
  }

  renderItem({item: {member, last_ts, last_message, last_foodsaver_id }}) {
    const other = getOtherParty(member)
        , date = moment(last_ts * 1000)
        , isToday = date.isSame(new Date(), 'day')

    return (
      <TouchableOpacity style={styles.row}>
        <View style={styles.image}>
          {other.photo &&
            <Image
              style={{flex: 1}}
              resizeMode="contain"
              source={{uri:  url + other.photo}}
            />
          }
        </View>
        <View style={{flex: 1, padding: 10}}>
          <View style={styles.header}>
            <Text>
              {other.name}
            </Text>
            <Text style={styles.date}>
              {date.format(isToday ? 'hh:mm' : 'MMMM Do')}
            </Text>
          </View>

          <View style={styles.lastMessage}>
            {last_foodsaver_id !== ownUserId &&
              <View style={{width: 18, marginRight: 8}}>
                <Image
                  style={{flex: 1}}
                  resizeMode="contain"
                  source={{uri: url + member.find(m => m.id === last_foodsaver_id).photo}}
                />
              </View>
            }
            <Text style={styles.lastMessageText}>
              {last_message}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
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
