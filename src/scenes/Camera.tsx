import { withNavigationFocus } from 'react-navigation'

import React, { Component, Fragment } from 'react'
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native'
import { RNCamera } from 'react-native-camera'
import { openSettings } from 'react-native-permissions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as reduxActions from '../common/actions'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import BackButton from '../components/BackButton'
import colors from '../common/colors'
import { Actions } from 'react-native-router-flux'
import { translate } from '../common/translation'

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
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 1,
    paddingTop: 3,
    backgroundColor: colors.green
  },
  galleryButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 1,
    paddingTop: 3,
    borderWidth: 0,
    borderColor: colors.background,
    backgroundColor: colors.transparent,
    position: 'absolute',
    left: 20
  }
})

type Props = {
  callback: (any) => void

  actions: any
  isFocused: boolean
}

class Camera extends Component<Props> {
  refs: {
    camera: RNCamera
  }

  shouldComponentUpdate() {
    return false
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
    const { callback } = this.props

    return <View style={styles.container} testID="camera.scene">
      <RNCamera
        ref="camera"
        captureAudio={false}
        style={{flex: 1}}
      >
        {({status}) =>
          <Fragment>
            {status === 'NOT_AUTHORIZED' &&
              <View style={{flex: 1, padding: 30, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{color: colors.white, textAlign: 'center'}}>
                  <Text>{translate('camera.not_authorized')}{'\n\n'}</Text>
                  <Text>{translate('camera.goto_settings')}</Text>
                </Text>
              </View>
            }
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.actionButton}
                hitSlop={{top: 25, left: 25, right: 25, bottom: 25}}
                onPress={async () => status === 'NOT_AUTHORIZED' ? await openSettings() : this.takePicture()}
                testID="camera.action"
              >
                <Icon
                  name={status === 'NOT_AUTHORIZED' ? 'settings' : 'camera'}
                  size={32}
                  color={colors.white}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.galleryButton}
                hitSlop={{top: 50, left: 50, right: 50, bottom: 50}}
                onPress={() => Actions.push('cameraRoll', {callback: (images) => {
                  Actions.popTo('offerBasket')
                  callback({uri: images[0].uri})
                }})}
                testID="camera.gallery"
              >
                <Icon
                  name="folder-image"
                  size={32}
                  color={colors.white}
                />
              </TouchableOpacity>

            </View>
          </Fragment>
        }
      </RNCamera>
      <BackButton />
    </View>
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
