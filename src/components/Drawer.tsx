import React, { PureComponent, Profiler } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import colors from '../common/colors'

import Version from './Version'
import Logo from './Logo'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as reduxActions from '../common/actions'

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
}

class Drawer extends PureComponent<Props> {
  render() {
    const {profile: {name}} = this.props

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Logo size={28} />
          <Text style={styles.username}>
            {name}
          </Text>
        </View>
        <View style={styles.content} />
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
