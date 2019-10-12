import React, { Component } from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as reduxActions from '../common/actions'
import colors from '../common/colors'

import { withBadge } from 'react-native-elements'
import { Bell } from '../common/typings'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

type Props = {
  bells: Bell[]
}

class DrawerIcon extends Component<Props> {
  render() {
    const { bells } = this.props
      , unreadBells = bells.reduce((sum, bell) => sum + (bell.isRead ? 0 : 1), 0)
      , Component = unreadBells ?
                    withBadge(unreadBells, {badgeStyle: {backgroundColor: colors.green}})(Icon) :
                    Icon

    return (
      <Component
        testID={`navigation.drawer`}
        name="menu"
        size={26}
        style={{color: colors.drawerButton, marginTop: 4}}
      />
    )
  }
}

const mapStateToProps = state => ({
  bells: state.bells,
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(reduxActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DrawerIcon)
