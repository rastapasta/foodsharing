import { withNavigationFocus } from 'react-navigation'

import React, { PureComponent } from 'react'
import { SafeAreaView, StyleSheet, FlatList, View, Text, TouchableOpacity } from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as reduxActions from '../common/actions'
import colors from '../common/colors'
import { foodsaver } from '../common/placeholder'
import { ConversationMember } from '../common/typings'
import RoundedImage from '../components/RoundedImage'
import { Actions } from 'react-native-router-flux'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  image: {
    width: '22%',
    padding: 10
  }
})

type Props = {
  conversationId: number

  conversations: any
  foodsavers: any
  actions: any
  isFocused: boolean
}

class ConversationMembers extends PureComponent<Props> {
  componentDidUpdate(prevProps: Props) {
    const { actions } = this.props
    if (prevProps.isFocused === false && this.props.isFocused === true)
      actions.navigation('conversationMembers')
  }

  async componentDidMount() {
    const { actions } = this.props
    actions.navigation('conversationMembers')
  }

  render() {
    const { conversationId, conversations, foodsavers } = this.props
          , conversation = conversations.find(conversation => conversation.id == conversationId) || {member: []}
          , members = conversation.member
                      .map(member => foodsaver(foodsavers[member]))
                      .sort((a, b) => a.name.localeCompare(b.name))

    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          style={{flex: 1}}
          data={members as ConversationMember[]}
          keyExtractor={foodsaver => 'groupMember.' + foodsaver.id}
          renderItem={({item: foodsaver}) =>
            <TouchableOpacity
              style={styles.row}
              onPress={() => Actions.push('profile', {id: foodsaver.id})}
            >
              <View style={styles.image}>
                <RoundedImage
                  style={{width: '100%'}}
                  photo={foodsaver.photo}
                />
              </View>
              <View>
                <Text>{foodsaver.name}</Text>
              </View>
            </TouchableOpacity>
          }
        />
      </SafeAreaView>
    )
  }
}

const mapStateToProps = state => ({
  conversations: state.conversations,
  foodsavers: state.foodsavers
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(reduxActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigationFocus(ConversationMembers))
