import { withNavigationFocus } from 'react-navigation'

import React, { PureComponent } from 'react'
import CameraRollPicker from 'react-native-camera-roll-picker'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as reduxActions from '../common/actions'

type Props = {
  callback: (any) => void

  actions: any
  isFocused: boolean
}

class Camera extends PureComponent<Props> {
  componentDidUpdate(prevProps: Props) {
    const { actions } = this.props
    if (prevProps.isFocused === false && this.props.isFocused === true)
      actions.navigation('cameraRoll')
  }

  componentDidMount() {
    const { actions } = this.props
    actions.navigation('cameraRoll')
  }

  render() {
    const { callback } = this.props
    return <CameraRollPicker
      callback={callback}
      groupTypes="All"
      selectSingleItem
    />
  }
}

const mapStateToProps = () => ({})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(reduxActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigationFocus(Camera))
