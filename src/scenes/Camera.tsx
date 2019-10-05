import { withNavigationFocus } from 'react-navigation'

import React, { PureComponent } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { RNCamera } from 'react-native-camera';

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as reduxActions from '../common/actions'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import BackButton from '../components/BackButton';
import colors from '../common/colors';
import { Actions } from 'react-native-router-flux';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 1,
    paddingTop: 3,
    backgroundColor: colors.green
  }
})

type Props = {
  callback: (any) => void

  actions: any
  isFocused: boolean
}

class Camera extends PureComponent<Props> {
  refs: {
    camera: RNCamera
  }

  componentDidUpdate(prevProps: Props) {
    const { actions } = this.props
    if (prevProps.isFocused === false && this.props.isFocused === true)
      actions.navigation('camera')
  }

  componentDidMount() {
    const { actions } = this.props
    actions.navigation('camera')
  }

  takePicture = async () => {
    const { camera } = this.refs
        , { callback } = this.props

    const picture = await camera.takePictureAsync({
      width: 800,
      quality: 0.7
    })

    Actions.pop()
    callback(picture)
  }

  render() {
    return <View style={styles.container}>
      <RNCamera
        ref="camera"
        captureAudio={false}
        style={{flex: 1}}
      />
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          hitSlop={{top: 50, left: 50, right: 50, bottom: 50}}
          onPress={this.takePicture}
        >
          <Icon name="camera" size={32} color={colors.white} />
        </TouchableOpacity>
      </View>
      <BackButton />
    </View>
  }
}

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(reduxActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigationFocus(Camera))
