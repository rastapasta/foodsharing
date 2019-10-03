import React , { PureComponent } from 'react'
import { Text, StyleSheet, TouchableOpacity } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import colors from '../common/colors'

import CookieManager from 'react-native-cookies'
import AsyncStorage from '@react-native-community/async-storage'

import { store } from '../common/store'
import { LOGOUT } from '../common/constants'

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 5
  },
  text: {
    color: colors.version,
    fontSize: 10
  }
})

export default class Version extends PureComponent {
  state = {
    version: '',
    build: ''
  }

  async componentDidMount() {
    this.setState({
      version: await DeviceInfo.getVersion(),
      build: await DeviceInfo.getBuildNumber()
    })
  }

  render() {
    const { version, build } = this.state

    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => {
          CookieManager.clearAll()
          AsyncStorage.clear()
          store.dispatch({type: LOGOUT})
        }}
      >
        <Text style={styles.text}>Version {version} (build #{build})</Text>
      </TouchableOpacity>
    )
  }
}