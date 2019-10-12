import React, { Component } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import colors from '../common/colors'
import { isIphoneX } from 'react-native-iphone-x-helper'

import DrawerButton from './DrawerButton'

import Version from './Version'
import Logo from './Logo'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as reduxActions from '../common/actions'
import config from '../common/config'
import { Actions } from 'react-native-router-flux'
import { Bell } from '../common/typings'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.drawerBackground,
    paddingTop: isIphoneX() ? 24 : 0
  },
  header: {
    height: 80,
    marginTop: 20,
    paddingLeft: 12,
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  username: {
    color: colors.drawerUser
  },
  content: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: colors.white
  },
  footer: {
    backgroundColor: colors.white,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

type Props = {
  profile: any
  bells: Bell[]
  actions: any
}

class Drawer extends Component<Props> {
  shouldComponentUpdate(next: Props) {
    const { profile, bells } = this.props

    return next.profile.name !== profile.name
        || (next.bells || []).length !== (bells || []).length
        || (next.bells.length && !next.bells.every(
          (bell, idx) => bells[idx].isRead !== bell.isRead
        ))
  }

  render() {
    const {profile: {name, id}, actions: { logout, fetchConversationId }, bells} = this.props
        , unreadBells = bells.reduce((sum, bell) => sum + (bell.isRead ? 0 : 1), 0)

    return (
      <View style={styles.container} testID="drawer">
        <View style={styles.header}>
          <Logo size={28} />
          <Text style={styles.username} testID="drawer.user">
            {name}
          </Text>
        </View>
        <View style={styles.content}>
          <DrawerButton
            onPress={() => Actions.jump('bells')}
            icon="bell"
            label="drawer.bells"
            highlight={unreadBells > 0}
            badge={unreadBells}
          />

          <DrawerButton
            onPress={() => Actions.jump('profile', {id})}
            icon="account"
            label="drawer.profile"
          />

          <DrawerButton
            onPress={() => fetchConversationId(config.feedbackUser)}
            icon="heart-outline"
            label="drawer.feedback"
          />

          <DrawerButton
            onPress={logout}
            icon="exit-to-app"
            label="drawer.logout"
          />
        </View>
        <View style={styles.footer}>
          <Version />
        </View>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  profile: state.profile,
  bells: state.bells
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(reduxActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Drawer)
