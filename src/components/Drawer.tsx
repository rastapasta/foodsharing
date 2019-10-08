import React, { PureComponent } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import colors from '../common/colors'

import DrawerButton from './DrawerButton'

import Version from './Version'
import Logo from './Logo'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as reduxActions from '../common/actions'
import { Actions } from 'react-native-router-flux'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.drawerBackground
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
  actions: any
}

class Drawer extends PureComponent<Props> {
  render() {
    const {profile: {name, id}, actions: { logout, fetchConversationId }} = this.props

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
            onPress={() => Actions.jump('profile', {id})}
            icon="account"
            label="drawer.profile"
          />

          <DrawerButton
            onPress={() => fetchConversationId(338241)}
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
  profile: state.profile
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(reduxActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Drawer)
